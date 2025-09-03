// FILE: /app/api/users/me/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, logAction } from '../../../../lib/rbac';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user preferences
    const fullUser = await User.findById(user._id).select('preferences');
    
    if (!fullUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      preferences: fullUser.preferences || {}
    });
    
  } catch (error) {
    console.error('Get user preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    const preferences = await req.json();
    
    // Validate preferences structure
    if (typeof preferences !== 'object' || preferences === null) {
      return NextResponse.json(
        { error: 'Preferences must be an object' },
        { status: 400 }
      );
    }
    
    // Validate theme preference
    if (preferences.theme && !['light', 'dark', 'system'].includes(preferences.theme)) {
      return NextResponse.json(
        { error: 'Theme must be light, dark, or system' },
        { status: 400 }
      );
    }
    
    // Validate language preference
    if (preferences.language && typeof preferences.language !== 'string') {
      return NextResponse.json(
        { error: 'Language must be a string' },
        { status: 400 }
      );
    }
    
    // Validate timezone preference
    if (preferences.timezone && typeof preferences.timezone !== 'string') {
      return NextResponse.json(
        { error: 'Timezone must be a string' },
        { status: 400 }
      );
    }
    
    // Validate notification preferences
    if (preferences.notifications && typeof preferences.notifications !== 'object') {
      return NextResponse.json(
        { error: 'Notifications must be an object' },
        { status: 400 }
      );
    }
    
    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        preferences: {
          ...user.preferences,
          ...preferences
        },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'PREFERENCES_UPDATED',
      'USER',
      'update',
      { preferences },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    );
    
    return NextResponse.json({
      success: true,
      preferences: updatedUser.preferences
    });
    
  } catch (error) {
    console.error('Update user preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
