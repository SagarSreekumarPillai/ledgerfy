// FILE: /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateTokens } from '@/lib/mockAuth'
import { findRoleById } from '@/lib/mockData'

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Mock login attempt started')
    
    const { email, password } = await req.json()
    console.log('📧 Login attempt for:', email)
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Authenticate user using mock data
    const user = await authenticateUser(email, password)
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Get role permissions
    const role = findRoleById(user.roleId)
    console.log('🔐 Password valid, generating tokens')
    
    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Log successful login
    console.log(`User ${user._id} logged in successfully`)

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        firmId: user.firmId,
        roleId: user.roleId,
        permissions: role?.permissions || [],
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

    console.log('✅ Mock login successful, tokens set')
    return response
  } catch (error) {
    console.error('❌ Mock login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
