// FILE: /app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get refresh token from cookie
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }
    
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    
    // Check if token is for refresh
    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }
    
    // Get user
    const user = await User.findById(decoded.userId).populate('roleId');
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }
    
    // Generate new access token
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
    
    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { 
        userId: user._id,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Set new refresh token as HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        firmId: user.firmId,
        roleId: user.roleId._id,
        permissions: user.roleId.permissions || [],
        mfaEnabled: user.mfaEnabled
      }
    });
    
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
