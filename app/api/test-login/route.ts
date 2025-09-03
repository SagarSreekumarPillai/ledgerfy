import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Test login started')
    
    const { email, password } = await req.json()
    console.log('📧 Test login for:', email)
    
    // Test database connection
    await dbConnect()
    console.log('✅ Database connected')
    
    // Test user lookup
    const user = await User.findOne({ email }).populate('roleId')
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    console.log('👤 User details:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      roleId: user.roleId?._id,
      permissions: (user.roleId as any)?.permissions
    })
    
    // Test password comparison
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('🔐 Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    // Test JWT signing
    const testToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )
    console.log('🎫 JWT token created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Test login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        permissions: (user.roleId as any)?.permissions || []
      },
      token: testToken
    })
    
  } catch (error) {
    console.error('❌ Test login error:', error)
    return NextResponse.json(
      { 
        error: 'Test login failed', 
        details: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    )
  }
}

