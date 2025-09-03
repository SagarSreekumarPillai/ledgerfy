// FILE: /app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, hasPermission, logAction } from '../../lib/rbac';
import dbConnect from '../../lib/db';
import User from '../../models/User';
import Role from '../../models/Role';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to view users
    if (!hasPermission(user, 'users:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const roleId = searchParams.get('roleId') || '';
    const status = searchParams.get('status') || '';
    
    // Build query
    const query: any = { firmId: user.firmId };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (roleId) {
      query.roleId = roleId;
    }
    
    if (status) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }
    
    // Get total count
    const total = await User.countDocuments(query);
    
    // Get users with pagination
    const users = await User.find(query)
      .populate('roleId')
      .select('-password -mfaSecret -mfaBackupCodes')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Get roles for filter dropdown
    const roles = await Role.find({ firmId: user.firmId })
      .select('name description')
      .sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      users,
      roles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to update users
    if (!hasPermission(user, 'users:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { userId, updates } = await req.json();
    
    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'User ID and updates are required' },
        { status: 400 }
      );
    }
    
    // Get user to update
    const userToUpdate = await User.findOne({ _id: userId, firmId: user.firmId });
    
    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Validate role update
    if (updates.roleId) {
      const role = await Role.findOne({ _id: updates.roleId, firmId: user.firmId });
      
      if (!role) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('roleId');
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'USER_UPDATED',
      'USER',
      'update',
      { 
        updatedUserId: userId,
        updates
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        firmId: updatedUser.firmId,
        roleId: updatedUser.roleId,
        isActive: updatedUser.isActive,
        isEmailVerified: updatedUser.isEmailVerified,
        mfaEnabled: updatedUser.mfaEnabled,
        lastLogin: updatedUser.lastLogin,
        preferences: updatedUser.preferences,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to delete users
    if (!hasPermission(user, 'users:delete')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Prevent self-deletion
    if (userId === user._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }
    
    // Get user to delete
    const userToDelete = await User.findOne({ _id: userId, firmId: user.firmId });
    
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Soft delete - mark as inactive instead of removing
    userToDelete.isActive = false;
    userToDelete.updatedAt = new Date();
    await userToDelete.save();
    
    // Log the action
    await logAction(
      user._id.toString(),
      'USER_DEACTIVATED',
      'USER',
      'delete',
      { 
        deactivatedUserId: userId,
        deactivatedEmail: userToDelete.email
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
