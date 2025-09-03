// FILE: /lib/rbac.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';
import AuditLog from '../models/AuditLog';

export interface AuthenticatedUser {
  _id: string;
  email: string;
  firmId: string;
  roleId: string;
  permissions: string[];
  firstName: string;
  lastName: string;
}

// Get user from JWT token
export async function getServerUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('token')?.value;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).populate('roleId');
    
    if (!user || !user.isActive) return null;
    
    return {
      _id: user._id.toString(),
      email: user.email,
      firmId: user.firmId.toString(),
      roleId: user.roleId._id.toString(),
      permissions: user.roleId.permissions || [],
      firstName: user.firstName,
      lastName: user.lastName
    };
  } catch (error) {
    return null;
  }
}

// Check if user has specific permission
export function hasPermission(user: AuthenticatedUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

// Check if user has any of the required permissions
export function hasAnyPermission(user: AuthenticatedUser, permissions: string[]): boolean {
  return permissions.some(permission => user.permissions.includes(permission));
}

// Check if user has all required permissions
export function hasAllPermissions(user: AuthenticatedUser, permissions: string[]): boolean {
  return permissions.every(permission => user.permissions.includes(permission));
}

// Log audit action
export async function logAction(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  meta: any = {},
  firmId: string,
  ip?: string,
  userAgent?: string
) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    await AuditLog.create({
      firmId: user.firmId,
      actorUserId: userId,
      actorRole: user.roleId,
      action,
      entityType,
      entityId,
      ip,
      userAgent,
      meta
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

// RBAC middleware wrapper
export async function requirePermission(
  req: NextRequest,
  permission: string,
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!hasPermission(user, permission)) {
      await logAction(
        user._id,
        'PERMISSION_DENIED',
        'API',
        req.url,
        { 
          requiredPermission: permission,
          path: req.url,
          method: req.method 
        },
        user.firmId,
        req.ip,
        req.headers.get('user-agent')
      );
      
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Log the action
    await logAction(
      user._id,
      permission,
      'API',
      req.url,
      { 
        path: req.url,
        method: req.method,
        body: req.body ? await req.json() : null
      },
      user.firmId,
      req.ip,
      req.headers.get('user-agent')
    );
    
    return handler(req, user);
  } catch (error) {
    console.error('RBAC middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Preset roles with permissions
export const PRESET_ROLES = {
  admin: [
    'org:read', 'org:write',
    'users:invite', 'users:update', 'users:delete', 'users:read',
    'roles:create', 'roles:update', 'roles:delete', 'roles:read',
    'clients:read', 'clients:write', 'clients:delete',
    'projects:create', 'projects:update', 'projects:delete', 'projects:read',
    'tasks:assign', 'tasks:update_status', 'tasks:timelog', 'tasks:read',
    'documents:upload', 'documents:read', 'documents:download', 'documents:share', 'documents:delete',
    'ledger:read', 'ledger:write', 'tally:import',
    'compliance:read', 'compliance:write', 'compliance:mark_filed',
    'analytics:read',
    'audit:read'
  ],
  partner: [
    'org:read',
    'users:invite', 'users:update', 'users:read',
    'clients:read', 'clients:write',
    'projects:create', 'projects:update', 'projects:read',
    'tasks:assign', 'tasks:update_status', 'tasks:read',
    'documents:upload', 'documents:read', 'documents:download', 'documents:share',
    'ledger:read', 'ledger:write', 'tally:import',
    'compliance:read', 'compliance:write', 'compliance:mark_filed',
    'analytics:read'
  ],
  manager: [
    'org:read',
    'clients:read', 'clients:write',
    'projects:create', 'projects:update', 'projects:read',
    'tasks:assign', 'tasks:update_status', 'tasks:read',
    'documents:upload', 'documents:read', 'documents:download',
    'ledger:read',
    'compliance:read', 'compliance:write',
    'analytics:read'
  ],
  senior: [
    'clients:read',
    'projects:read',
    'tasks:update_status', 'tasks:read',
    'documents:read', 'documents:download',
    'ledger:read',
    'compliance:read', 'compliance:write',
    'analytics:read'
  ],
  associate: [
    'clients:read',
    'projects:read',
    'tasks:read', 'tasks:update_status',
    'documents:upload', 'documents:read',
    'compliance:read'
  ],
  client: [
    'documents:read', 'documents:upload',
    'compliance:read'
  ]
};

// Create preset roles for a firm
export async function createPresetRoles(firmId: string, createdBy: string) {
  try {
    const roles = [];
    
    for (const [roleName, permissions] of Object.entries(PRESET_ROLES)) {
      const role = await Role.create({
        firmId,
        name: roleName,
        description: `Preset ${roleName} role`,
        permissions,
        isPreset: true,
        createdBy
      });
      roles.push(role);
    }
    
    return roles;
  } catch (error) {
    console.error('Failed to create preset roles:', error);
    throw error;
  }
}
