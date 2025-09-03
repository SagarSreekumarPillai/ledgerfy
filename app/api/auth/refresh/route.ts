// FILE: /app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    // Get refresh token from cookies
    const refreshToken = req.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any
    
    if (decoded.type !== 'refresh') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 401 })
    }
    
    // Find user and verify refresh token
    const user = await User.findById(decoded.userId).populate('roleId')
    
    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        firmId: user.firmId,
        roleId: user.roleId._id
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )
    
    // Set new access token as cookie
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        firmId: user.firmId,
        roleId: user.roleId._id,
        permissions: (user.roleId as any).permissions || [],
        mfaEnabled: user.mfaEnabled,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified
      }
    })
    
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 })
  }
}
