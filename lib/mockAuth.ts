// FILE: /lib/mockAuth.ts
// Mock authentication service for hardcoded deployment

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById, findRoleById, MockUser } from './mockData';

export interface MockServerUser {
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
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<MockUser | null> {
  const user = findUserByEmail(email);
  
  if (!user || !user.isActive) {
    console.log('❌ User not found or inactive:', email);
    return null;
  }

  // For mock data, use simple password comparison
  // All mock users have password 'password123'
  const isValidPassword = password === 'password123';
  
  if (!isValidPassword) {
    console.log('❌ Invalid password for user:', email);
    return null;
  }

  console.log('✅ Password valid for user:', email);
  
  // Update last login
  user.lastLogin = new Date();
  
  return user;
}

/**
 * Generate JWT tokens for user
 */
export function generateTokens(user: MockUser) {
  const accessToken = jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      firmId: user.firmId,
      roleId: user.roleId
    },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { 
      userId: user._id,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
    { expiresIn: '7d' }
  );

  // Store refresh token in user object
  user.refreshToken = refreshToken;

  return { accessToken, refreshToken };
}

/**
 * Verify JWT token and get user
 */
export function verifyTokenAndGetUser(token: string): MockServerUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    
    if (!decoded || !decoded.userId) {
      return null;
    }

    const user = findUserById(decoded.userId);
    const role = findRoleById(user?.roleId || '');
    
    if (!user || !user.isActive || !role) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      firmId: user.firmId,
      roleId: user.roleId,
      permissions: role.permissions,
      mfaEnabled: user.mfaEnabled,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin.toISOString()
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Get user from token (for API routes)
 */
export function getUserFromToken(token: string): MockUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    
    if (!decoded || !decoded.userId) {
      return null;
    }

    const user = findUserById(decoded.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: MockServerUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: MockServerUser, permissions: string[]): boolean {
  return permissions.some(permission => user.permissions.includes(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: MockServerUser, permissions: string[]): boolean {
  return permissions.every(permission => user.permissions.includes(permission));
}
