// FILE: /app/api/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, hasPermission, logAction } from '../../lib/rbac';
import dbConnect from '../../lib/db';
import Role from '../../models/Role';
import Permission from '../../models/Permission';

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
    
    // Check if user has permission to view roles
    if (!hasPermission(user, 'roles:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const isPreset = searchParams.get('isPreset');
    
    // Build query
    const query: any = { firmId: user.firmId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isPreset !== null && isPreset !== undefined) {
      query.isPreset = isPreset === 'true';
    }
    
    // Get total count
    const total = await Role.countDocuments(query);
    
    // Get roles with pagination
    const roles = await Role.find(query)
      .populate('permissions')
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Get all available permissions for role creation/editing
    const permissions = await Permission.find({ isSystem: true })
      .select('name category description')
      .sort({ category: 1, name: 1 });
    
    return NextResponse.json({
      success: true,
      roles,
      permissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to create roles
    if (!hasPermission(user, 'roles:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { name, description, permissions } = await req.json();
    
    // Validate input
    if (!name || !description || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name, description, and permissions array are required' },
        { status: 400 }
      );
    }
    
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }
    
    if (permissions.length === 0) {
      return NextResponse.json(
        { error: 'At least one permission is required' },
        { status: 400 }
      );
    }
    
    // Check if role name already exists in the firm
    const existingRole = await Role.findOne({ 
      name: name.trim(), 
      firmId: user.firmId 
    });
    
    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 400 }
      );
    }
    
    // Validate permissions exist
    const validPermissions = await Permission.find({ 
      name: { $in: permissions },
      isSystem: true
    });
    
    if (validPermissions.length !== permissions.length) {
      return NextResponse.json(
        { error: 'One or more permissions are invalid' },
        { status: 400 }
      );
    }
    
    // Create new role
    const newRole = new Role({
      name: name.trim(),
      description: description.trim(),
      permissions: permissions,
      firmId: user.firmId,
      isPreset: false
    });
    
    await newRole.save();
    
    // Populate permissions for response
    await newRole.populate('permissions');
    
    // Log the action
    await logAction(
      user._id.toString(),
      'ROLE_CREATED',
      'ROLE',
      'create',
      { 
        roleName: newRole.name,
        roleId: newRole._id,
        permissions: newRole.permissions
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      message: 'Role created successfully',
      role: newRole
    });
    
  } catch (error) {
    console.error('Create role error:', error);
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
    
    // Check if user has permission to update roles
    if (!hasPermission(user, 'roles:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { roleId, updates } = await req.json();
    
    if (!roleId || !updates) {
      return NextResponse.json(
        { error: 'Role ID and updates are required' },
        { status: 400 }
      );
    }
    
    // Get role to update
    const roleToUpdate = await Role.findOne({ 
      _id: roleId, 
      firmId: user.firmId 
    });
    
    if (!roleToUpdate) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }
    
    // Prevent updating preset roles
    if (roleToUpdate.isPreset) {
      return NextResponse.json(
        { error: 'Cannot modify preset roles' },
        { status: 400 }
      );
    }
    
    // Validate permissions if being updated
    if (updates.permissions && Array.isArray(updates.permissions)) {
      if (updates.permissions.length === 0) {
        return NextResponse.json(
          { error: 'At least one permission is required' },
          { status: 400 }
        );
      }
      
      const validPermissions = await Permission.find({ 
        name: { $in: updates.permissions },
        isSystem: true
      });
      
      if (validPermissions.length !== updates.permissions.length) {
        return NextResponse.json(
          { error: 'One or more permissions are invalid' },
          { status: 400 }
        );
      }
    }
    
    // Update role
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('permissions');
    
    if (!updatedRole) {
      return NextResponse.json(
        { error: 'Failed to update role' },
        { status: 500 }
      );
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'ROLE_UPDATED',
      'ROLE',
      'update',
      { 
        roleId: roleId,
        roleName: updatedRole.name,
        updates
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
      role: updatedRole
    });
    
  } catch (error) {
    console.error('Update role error:', error);
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
    
    // Check if user has permission to delete roles
    if (!hasPermission(user, 'roles:delete')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get('roleId');
    
    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }
    
    // Get role to delete
    const roleToDelete = await Role.findOne({ 
      _id: roleId, 
      firmId: user.firmId 
    });
    
    if (!roleToDelete) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }
    
    // Prevent deleting preset roles
    if (roleToDelete.isPreset) {
      return NextResponse.json(
        { error: 'Cannot delete preset roles' },
        { status: 400 }
      );
    }
    
    // Check if role is assigned to any users
    const User = (await import('../../models/User')).default;
    const usersWithRole = await User.countDocuments({ 
      roleId: roleId,
      firmId: user.firmId 
    });
    
    if (usersWithRole > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that is assigned to users' },
        { status: 400 }
      );
    }
    
    // Delete the role
    await Role.findByIdAndDelete(roleId);
    
    // Log the action
    await logAction(
      user._id.toString(),
      'ROLE_DELETED',
      'ROLE',
      'delete',
      { 
        roleId: roleId,
        roleName: roleToDelete.name
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
