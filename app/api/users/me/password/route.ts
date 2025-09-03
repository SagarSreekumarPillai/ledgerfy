// FILE: /app/api/users/me/password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, logAction } from '@/lib/rbac';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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
    
    const { currentPassword, newPassword } = await req.json();
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }
    
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Get full user with password
    const fullUser = await User.findById(user._id).select('+password');
    
    if (!fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Verify current password
    const isValidPassword = await fullUser.comparePassword(currentPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    fullUser.password = hashedPassword;
    fullUser.updatedAt = new Date();
    await fullUser.save();
    
    // Log the action
    await logAction(
      user._id.toString(),
      'PASSWORD_CHANGED',
      'USER',
      'update',
      { passwordChanged: true },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
