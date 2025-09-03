// FILE: /app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, logAction } from '../../../lib/rbac';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (user) {
      // Log the logout action
      await logAction(
        user._id.toString(),
        'LOGOUT',
        'AUTH',
        'logout',
        { ip: req.ip, userAgent: req.headers.get('user-agent') },
        user.firmId.toString(),
        req.ip,
        req.headers.get('user-agent')
      );
    }
    
    // Clear the refresh token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, clear the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
    
    return response;
  }
}
