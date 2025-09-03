import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Get token from cookies
    const token = req.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // Get user from database
    const user = await User.findById(payload.userId).select('-password')
    
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}

