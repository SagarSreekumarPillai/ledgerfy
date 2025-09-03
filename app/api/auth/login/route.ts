// FILE: /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import { User } from '@/models'

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Login attempt started')
    
    await dbConnect()
    console.log('✅ Database connected')
    
    const { email, password } = await req.json()
    console.log('📧 Login attempt for:', email)
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user by email and populate role
    const user = await User.findOne({ email }).populate('roleId')
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('🔐 Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log(`Failed login attempt for user ${user._id} from ${req.ip}`)
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Update last login
    user.lastLogin = new Date()
    await user.save()
    console.log('✅ Last login updated')
    
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
    )

    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    // Store refresh token in user document
    user.refreshToken = refreshToken
    await user.save()

    // Log successful login
    console.log(`User ${user._id} logged in successfully from ${req.ip}`)

    // Create response with user data
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

    // Set both tokens as HTTP-only cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    console.log('✅ Login successful, tokens set')
    return response
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
