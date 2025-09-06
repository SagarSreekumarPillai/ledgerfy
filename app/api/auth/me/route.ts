import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/mockAuth'

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify token and get user from mock data
    const user = verifyTokenAndGetUser(token)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Mock auth check error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}

