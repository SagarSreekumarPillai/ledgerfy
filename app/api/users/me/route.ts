// FILE: /app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, logAction } from '@/lib/rbac';
import dbConnect from '@/lib/db';
import User from '@/models/User';

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
    
    // Get full user details with role
    const fullUser = await User.findById(user._id)
      .populate('roleId')
      .select('-password -mfaSecret -mfaBackupCodes');
    
    if (!fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        _id: fullUser._id,
        email: fullUser.email,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        phone: fullUser.phone,
        firmId: fullUser.firmId,
        roleId: fullUser.roleId,
        permissions: (fullUser.roleId as any).permissions || [],
        mfaEnabled: fullUser.mfaEnabled,
        isActive: fullUser.isActive,
        isEmailVerified: fullUser.isEmailVerified,
        lastLogin: fullUser.lastLogin,
        preferences: fullUser.preferences,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
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
    
    const { firstName, lastName, phone, preferences } = await req.json();
    
    // Validate input
    if (firstName && typeof firstName !== 'string') {
      return NextResponse.json(
        { error: 'First name must be a string' },
        { status: 400 }
      );
    }
    
    if (lastName && typeof lastName !== 'string') {
      return NextResponse.json(
        { error: 'Last name must be a string' },
        { status: 400 }
      );
    }
    
    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone must be a string' },
        { status: 400 }
      );
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(preferences && { preferences }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('roleId');
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'PROFILE_UPDATED',
      'USER',
      'update',
      { firstName, lastName, phone, preferences },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({
      success: true,
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        firmId: updatedUser.firmId,
        roleId: updatedUser.roleId,
        permissions: (updatedUser.roleId as any).permissions || [],
        mfaEnabled: updatedUser.mfaEnabled,
        isActive: updatedUser.isActive,
        isEmailVerified: updatedUser.isEmailVerified,
        lastLogin: updatedUser.lastLogin,
        preferences: updatedUser.preferences,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
