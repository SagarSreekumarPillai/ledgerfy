import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenAndGetUser, hasPermission } from '@/lib/mockAuth'
import { getClientsByFirm } from '@/lib/mockData'

export async function POST(req: NextRequest) {
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
    
    // Check if user has permission to create clients
    if (!hasPermission(user, 'clients:write')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Create mock client (in real app, this would be saved to database)
    const client = {
      _id: `client_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      address: body.address || '',
      gstNumber: body.gstNumber || '',
      panNumber: body.panNumber || '',
      status: body.status || 'active',
      firmId: user.firmId,
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client
    })
    
  } catch (error) {
    console.error('Mock create client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    
    // Check if user has permission to view clients
    if (!hasPermission(user, 'clients:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    
    // Get clients from mock data
    let clients = getClientsByFirm(user.firmId)
    
    // Apply search filter
    if (search) {
      clients = clients.filter(client => 
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply pagination
    const total = clients.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClients = clients.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      clients: paginatedClients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Mock get clients error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
