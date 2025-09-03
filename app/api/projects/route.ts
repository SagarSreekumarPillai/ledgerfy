import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission, logAction } from '@/lib/rbac'
import dbConnect from '@/lib/db'
import Project from '@/models/Project'

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
    
    // Check if user has permission to create projects
    if (!hasPermission(user, 'projects:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.clientId || !body.startDate || !body.endDate || !body.projectManager) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create project
    const project = new Project({
      ...body,
      firmId: user.firmId,
      createdBy: user._id,
      status: body.status || 'planning',
      priority: body.priority || 'medium',
      progress: body.progress || 0,
      currency: body.currency || 'INR'
    })
    
    await project.save()
    
    // Populate references for response
    await project.populate([
      { path: 'clientId', select: 'name' },
      { path: 'projectManager', select: 'firstName lastName' },
      { path: 'teamMembers', select: 'firstName lastName' },
      { path: 'createdBy', select: 'firstName lastName' }
    ])
    
    // Log the action
    await logAction(
      user._id.toString(),
      'PROJECT_CREATED',
      'PROJECT',
      'create',
      { 
        projectId: project._id,
        name: project.name,
        clientId: project.clientId,
        projectType: project.projectType
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    )
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project
    })
    
  } catch (error) {
    console.error('Create project error:', error)
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
    
    // Check if user has permission to view projects
    if (!hasPermission(user, 'projects:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const projectType = searchParams.get('projectType') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const clientId = searchParams.get('clientId') || ''
    const projectManager = searchParams.get('projectManager') || ''
    const assignedTo = searchParams.get('assignedTo') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    
    // Build query
    const query: any = { firmId: user.firmId }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (projectType) {
      query.projectType = projectType
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
    
    if (projectManager) {
      query.projectManager = projectManager
    }
    
    if (assignedTo) {
      query.teamMembers = assignedTo
    }
    
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) }
    }
    
    if (endDate) {
      query.endDate = { $lte: new Date(endDate) }
    }
    
    // Get total count
    const total = await Project.countDocuments(query)
    
    // Get projects with pagination
    const projects = await Project.find(query)
      .populate('clientId', 'name')
      .populate('projectManager', 'firstName lastName')
      .populate('teamMembers', 'firstName lastName')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
