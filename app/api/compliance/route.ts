import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission, logAction } from '@/lib/rbac'
import dbConnect from '@/lib/db'
import ComplianceItem from '@/models/ComplianceItem'

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
    
    // Check if user has permission to create compliance items
    if (!hasPermission(user, 'compliance:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.clientId || !body.financialYear || !body.filingPeriod || !body.dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create compliance item
    const complianceItem = new ComplianceItem({
      ...body,
      firmId: user.firmId,
      createdBy: user._id,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      progress: body.progress || 0
    })
    
    await complianceItem.save()
    
    // Populate references for response
    await complianceItem.populate([
      { path: 'clientId', select: 'name' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'createdBy', select: 'firstName lastName' }
    ])
    
    // Log the action
    await logAction(
      user._id.toString(),
      'COMPLIANCE_ITEM_CREATED',
      'COMPLIANCE_ITEM',
      'create',
      { 
        complianceItemId: complianceItem._id,
        title: complianceItem.title,
        complianceType: complianceItem.complianceType,
        dueDate: complianceItem.dueDate
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    )
    
    return NextResponse.json({
      success: true,
      message: 'Compliance item created successfully',
      complianceItem
    })
    
  } catch (error) {
    console.error('Create compliance item error:', error)
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
    
    // Check if user has permission to view compliance items
    if (!hasPermission(user, 'compliance:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const complianceType = searchParams.get('complianceType') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const clientId = searchParams.get('clientId') || ''
    const assignedTo = searchParams.get('assignedTo') || ''
    const financialYear = searchParams.get('financialYear') || ''
    const filingPeriod = searchParams.get('filingPeriod') || ''
    const dueDateFrom = searchParams.get('dueDateFrom') || ''
    const dueDateTo = searchParams.get('dueDateTo') || ''
    
    // Build query
    const query: any = { firmId: user.firmId }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (complianceType) {
      query.complianceType = complianceType
    }
    
    if (status) {
      query.status = status
    }
    
    if (priority) {
      query.priority = priority
    }
    
    if (clientId) {
      query.clientId = clientId
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo
    }
    
    if (financialYear) {
      query.financialYear = financialYear
    }
    
    if (filingPeriod) {
      query.filingPeriod = filingPeriod
    }
    
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {}
      if (dueDateFrom) {
        query.dueDate.$gte = new Date(dueDateFrom)
      }
      if (dueDateTo) {
        query.dueDate.$lte = new Date(dueDateTo)
      }
    }
    
    // Get total count
    const total = await ComplianceItem.countDocuments(query)
    
    // Get compliance items with pagination
    const complianceItems = await ComplianceItem.find(query)
      .populate('clientId', 'name')
      .populate('assignedTo', 'firstName lastName')
      .populate('createdBy', 'firstName lastName')
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      complianceItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get compliance items error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
