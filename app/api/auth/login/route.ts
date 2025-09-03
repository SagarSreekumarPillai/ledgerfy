// FILE: /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { logAction } from '../../../../lib/rbac';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await User.findOne({ email }).populate('roleId');
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      // Log failed login attempt
      await logAction(
        user._id.toString(),
        'LOGIN_FAILED',
        'AUTH',
        'login',
        { email, ip: req.ip, userAgent: req.headers.get('user-agent') },
        user.firmId.toString(),
        req.ip,
        req.headers.get('user-agent')
      );
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        firmId: user.firmId,
        roleId: user.roleId._id
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Log successful login
    await logAction(
      user._id.toString(),
      'LOGIN_SUCCESS',
      'AUTH',
      'login',
      { ip: req.ip, userAgent: req.headers.get('user-agent') },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    // Set refresh token as HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        firmId: user.firmId,
        roleId: user.roleId._id,
        permissions: user.roleId.permissions || [],
        mfaEnabled: user.mfaEnabled
      },
      accessToken
    });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
