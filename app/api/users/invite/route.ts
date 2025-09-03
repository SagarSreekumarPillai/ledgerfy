// FILE: /app/api/users/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, hasPermission, logAction } from '../../../lib/rbac';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import Role from '../../../models/Role';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

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
    
    // Check if user has permission to invite users
    if (!hasPermission(user, 'users:invite')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const { email, firstName, lastName, roleId, phone } = await req.json();
    
    // Validate input
    if (!email || !firstName || !lastName || !roleId) {
      return NextResponse.json(
        { error: 'Email, first name, last name, and role are required' },
        { status: 400 }
      );
    }
    
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }
    
    if (typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }
    
    if (typeof lastName !== 'string' || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Verify role exists and belongs to the same firm
    const role = await Role.findOne({ _id: roleId, firmId: user.firmId });
    
    if (!role) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).substring(2, 10);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    
    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone || '',
      password: hashedPassword,
      firmId: user.firmId,
      roleId: roleId,
      isActive: true,
      isEmailVerified: false,
      preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'Asia/Kolkata'
      }
    });
    
    await newUser.save();
    
    // Send invitation email
    try {
      await sendInvitationEmail(email, firstName, tempPassword);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue even if email fails
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'USER_INVITED',
      'USER',
      'create',
      { 
        invitedEmail: email,
        invitedUserId: newUser._id,
        roleId: roleId
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      message: 'User invited successfully',
      user: {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roleId: newUser.roleId,
        isActive: newUser.isActive
      }
    });
    
  } catch (error) {
    console.error('User invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendInvitationEmail(email: string, firstName: string, tempPassword: string) {
  // Configure email transporter (you'll need to set up SMTP credentials)
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@ledgerfy.com',
    to: email,
    subject: 'Welcome to Ledgerfy - Your Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Welcome to Ledgerfy!</h2>
        <p>Hi ${firstName},</p>
        <p>You have been invited to join Ledgerfy. Here are your account details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p><strong>Important:</strong> Please change your password after your first login.</p>
        <p>Best regards,<br>The Ledgerfy Team</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}
