// FILE: /app/api/test-auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/mockData'

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing mock authentication data')
    
    // Test finding users
    const adminUser = findUserByEmail('admin@ledgerfy.com')
    const managerUser = findUserByEmail('manager@ledgerfy.com')
    const accountantUser = findUserByEmail('accountant@ledgerfy.com')
    
    console.log('👤 Admin user found:', adminUser ? 'Yes' : 'No')
    console.log('👤 Manager user found:', managerUser ? 'Yes' : 'No')
    console.log('👤 Accountant user found:', accountantUser ? 'Yes' : 'No')
    
    return NextResponse.json({
      success: true,
      test: 'Mock authentication data test',
      users: {
        admin: adminUser ? { id: adminUser._id, email: adminUser.email, active: adminUser.isActive } : null,
        manager: managerUser ? { id: managerUser._id, email: managerUser.email, active: managerUser.isActive } : null,
        accountant: accountantUser ? { id: accountantUser._id, email: accountantUser.email, active: accountantUser.isActive } : null
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        useMockData: process.env.USE_MOCK_DATA,
        jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
      }
    })
  } catch (error) {
    console.error('❌ Test auth error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

