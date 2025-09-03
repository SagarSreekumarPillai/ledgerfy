import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Test endpoint called')
    
    await dbConnect()
    console.log('✅ Database connected in test')
    
    const userCount = await User.countDocuments()
    console.log('👥 User count:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Test successful',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Test error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}

