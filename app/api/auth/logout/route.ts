// FILE: /app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
    
    // Clear cookies
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, clear cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    
    return response
  }
}
