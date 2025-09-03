// FILE: /lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export interface ServerUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  firmId: string;
  roleId: string;
  permissions: string[];
  mfaEnabled: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string;
}

/**
 * Get the current user from the server context
 * This function should be used in API routes and server components
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Get user from database
    const user = await User.findById(decoded.userId)
      .populate('roleId', 'permissions')
      .lean();

    if (!user || !(user as any).isActive) {
      return null;
    }

    // Transform to ServerUser format
    const serverUser: ServerUser = {
      _id: (user as any)._id.toString(),
      email: (user as any).email,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
      firmId: (user as any).firmId.toString(),
      roleId: ((user as any).roleId as any)._id.toString(),
      permissions: ((user as any).roleId as any).permissions || [],
      mfaEnabled: (user as any).mfaEnabled || false,
      isActive: (user as any).isActive,
      isEmailVerified: (user as any).isEmailVerified || false,
      lastLogin: (user as any).lastLogin?.toISOString() || new Date().toISOString()
    };

    return serverUser;
  } catch (error) {
    console.error('getServerUser error:', error);
    return null;
  }
}

/**
 * Require authentication - throws error if user not authenticated
 */
export async function requireAuth(): Promise<ServerUser> {
  const user = await getServerUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Get user permissions for RBAC checks
 */
export async function getUserPermissions(): Promise<string[]> {
  const user = await getServerUser();
  return user?.permissions || [];
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const permissions = await getUserPermissions();
  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(permissions: string[]): Promise<boolean> {
  const userPermissions = await getUserPermissions();
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(permissions: string[]): Promise<boolean> {
  const userPermissions = await getUserPermissions();
  return permissions.every(permission => userPermissions.includes(permission));
}
