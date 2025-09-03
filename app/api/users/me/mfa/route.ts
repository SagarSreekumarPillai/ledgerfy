// FILE: /app/api/users/me/mfa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, logAction } from '@/lib/rbac';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';

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
    
    const { action, password, code, backupCode } = await req.json();
    
    if (!action || !password) {
      return NextResponse.json(
        { error: 'Action and password are required' },
        { status: 400 }
      );
    }
    
    // Get full user with password
    const fullUser = await User.findById(user._id).select('+password +mfaSecret +mfaBackupCodes');
    
    if (!fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Verify password
    const isValidPassword = await fullUser.comparePassword(password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 400 }
      );
    }
    
    if (action === 'enable') {
      // Generate new MFA secret
      const secret = authenticator.generateSecret();
      const backupCodes = generateBackupCodes();
      
      // Store secret and backup codes
      fullUser.mfaSecret = secret;
      fullUser.mfaBackupCodes = backupCodes;
      fullUser.mfaEnabled = false; // Will be enabled after verification
      fullUser.updatedAt = new Date();
      await fullUser.save();
      
      // Log the action
      await logAction(
        user._id.toString(),
        'MFA_SETUP_INITIATED',
        'USER',
        'create',
        { mfaSetup: true },
        user.firmId.toString(),
        req.ip,
        req.headers.get('user-agent') || undefined
      );
      
      return NextResponse.json({
        success: true,
        secret,
        backupCodes,
        message: 'MFA setup initiated. Please verify with the code from your authenticator app.'
      });
      
    } else if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        );
      }
      
      // Verify TOTP code
      if (!fullUser.mfaSecret) {
        return NextResponse.json(
          { error: 'MFA secret not found' },
          { status: 400 }
        );
      }
      
      const isValidCode = authenticator.verify({
        token: code,
        secret: fullUser.mfaSecret
      });
      
      if (!isValidCode) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        );
      }
      
      // Enable MFA
      fullUser.mfaEnabled = true;
      fullUser.updatedAt = new Date();
      await fullUser.save();
      
      // Log the action
      await logAction(
        user._id.toString(),
        'MFA_ENABLED',
        'USER',
        'update',
        { mfaEnabled: true },
        user.firmId.toString(),
        req.ip,
        req.headers.get('user-agent') || undefined
      );
      
      return NextResponse.json({
        success: true,
        message: 'MFA enabled successfully'
      });
      
    } else if (action === 'disable') {
      // Disable MFA
      fullUser.mfaEnabled = false;
      fullUser.mfaSecret = undefined;
      fullUser.mfaBackupCodes = undefined;
      fullUser.updatedAt = new Date();
      await fullUser.save();
      
      // Log the action
      await logAction(
        user._id.toString(),
        'MFA_DISABLED',
        'USER',
        'update',
        { mfaEnabled: false },
        user.firmId.toString(),
        req.ip,
        req.headers.get('user-agent') || undefined
      );
      
      return NextResponse.json({
        success: true,
        message: 'MFA disabled successfully'
      });
      
    } else if (action === 'verify-backup') {
      if (!backupCode) {
        return NextResponse.json(
          { error: 'Backup code is required' },
          { status: 400 }
        );
      }
      
      // Verify backup code
      if (!fullUser.mfaBackupCodes) {
        return NextResponse.json(
          { error: 'MFA backup codes not found' },
          { status: 400 }
        );
      }
      
      const isValidBackupCode = fullUser.mfaBackupCodes.includes(backupCode);
      
      if (!isValidBackupCode) {
        return NextResponse.json(
          { error: 'Invalid backup code' },
          { status: 400 }
        );
      }
      
      // Remove used backup code
      fullUser.mfaBackupCodes = fullUser.mfaBackupCodes.filter((code: string) => code !== backupCode);
      fullUser.updatedAt = new Date();
      await fullUser.save();
      
      // Log the action
      await logAction(
        user._id.toString(),
        'MFA_BACKUP_CODE_USED',
        'USER',
        'update',
        { backupCodeUsed: true },
        user.firmId.toString(),
        req.ip,
        req.headers.get('user-agent') || undefined
      );
      
      return NextResponse.json({
        success: true,
        message: 'Backup code verified successfully'
      });
      
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('MFA operation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
  }
  return codes;
}
