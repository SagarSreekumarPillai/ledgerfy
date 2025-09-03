import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission, logAction } from '@/lib/rbac'
import dbConnect from '@/lib/db'
import Client from '@/models/Client'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const user = await getServerUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user has permission to create clients
    if (!hasPermission(user, 'clients:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.primaryContact || !body.billingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate primary contact
    if (!body.primaryContact.name || !body.primaryContact.email) {
      return NextResponse.json(
        { error: 'Primary contact name and email are required' },
        { status: 400 }
      )
    }
    
    // Validate billing address
    if (!body.billingAddress.street || !body.billingAddress.city || 
        !body.billingAddress.state || !body.billingAddress.postalCode || 
        !body.billingAddress.country) {
      return NextResponse.json(
        { error: 'Complete billing address is required' },
        { status: 400 }
      )
    }
    
    // Create client
    const client = new Client({
      ...body,
      firmId: user.firmId,
      createdBy: user._id,
      status: body.status || 'active',
      riskLevel: body.riskLevel || 'medium',
      currency: body.currency || 'INR',
      preferredContactMethod: body.preferredContactMethod || 'email',
      preferredLanguage: body.preferredLanguage || 'english',
      timezone: body.timezone || 'Asia/Kolkata',
      services: body.services || [],
      complianceTypes: body.complianceTypes || [],
      riskFactors: body.riskFactors || [],
      secondaryContacts: body.secondaryContacts || []
    })
    
    await client.save()
    
    // Populate references for response
    await client.populate([
      { path: 'createdBy', select: 'firstName lastName' }
    ])
    
    // Log the action
    await logAction(
      user._id.toString(),
      'CLIENT_CREATED',
      'CLIENT',
      'create',
      { 
        clientId: client._id,
        name: client.name,
        clientType: client.clientType,
        status: client.status
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    )
    
    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client
    })
    
  } catch (error) {
    console.error('Create client error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid GSTIN format')) {
        return NextResponse.json(
          { error: 'Invalid GSTIN format' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid PAN format')) {
        return NextResponse.json(
          { error: 'Invalid PAN format' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid TAN format')) {
        return NextResponse.json(
          { error: 'Invalid TAN format' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid CIN format')) {
        return NextResponse.json(
          { error: 'Invalid CIN format' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid LLPIN format')) {
        return NextResponse.json(
          { error: 'Invalid LLPIN format' },
          { status: 400 }
        )
      }
      if (error.message.includes('Relationship start date must be before end date')) {
        return NextResponse.json(
          { error: 'Relationship start date must be before end date' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const user = await getServerUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
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
    const clientType = searchParams.get('clientType') || ''
    const status = searchParams.get('status') || ''
    const industry = searchParams.get('industry') || ''
    const riskLevel = searchParams.get('riskLevel') || ''
    const hasGstin = searchParams.get('hasGstin') || ''
    const hasPan = searchParams.get('hasPan') || ''
    
    // Build query
    const query: any = { firmId: user.firmId }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'primaryContact.name': { $regex: search, $options: 'i' } },
        { 'primaryContact.email': { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { sector: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (clientType) {
      query.clientType = clientType
    }
    
    if (status) {
      query.status = status
    }
    
    if (industry) {
      query.industry = industry
    }
    
    if (riskLevel) {
      query.riskLevel = riskLevel
    }
    
    if (hasGstin === 'true') {
      query.gstin = { $exists: true, $ne: '' }
    }
    
    if (hasPan === 'true') {
      query.pan = { $exists: true, $ne: '' }
    }
    
    // Get total count
    const total = await Client.countDocuments(query)
    
    // Get clients with pagination
    const clients = await Client.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
