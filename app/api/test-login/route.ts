import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateTokens } from '@/lib/mockAuth'
import { findRoleById } from '@/lib/mockData'

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Mock test login started')
    
    const { email, password } = await req.json()
    console.log('📧 Test login for:', email)
    
    // Test user lookup with mock data
    const user = await authenticateUser(email, password)
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found or invalid credentials' }, { status: 404 })
    }
    
    const role = findRoleById(user.roleId)
    console.log('👤 User details:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      roleId: user.roleId,
      permissions: role?.permissions
    })
    
    console.log('🔐 Password valid, generating test token')
    
    // Test JWT signing
    const { accessToken } = generateTokens(user)
    console.log('🎫 JWT token created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Mock test login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        permissions: role?.permissions || []
      },
      token: accessToken
    })
    
  } catch (error) {
    console.error('❌ Mock test login error:', error)
    return NextResponse.json(
      { 
        error: 'Mock test login failed', 
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}

