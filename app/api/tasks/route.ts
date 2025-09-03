import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission, logAction } from '@/lib/rbac'
import dbConnect from '@/lib/db'
import Task from '@/models/Task'

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
    
    // Check if user has permission to create tasks
    if (!hasPermission(user, 'tasks:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }
    
    // Create task
    const task = new Task({
      ...body,
      firmId: user.firmId,
      createdBy: user._id,
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      progress: body.progress || 0,
      complexity: body.complexity || 'medium',
      timeSpent: body.timeSpent || 0,
      tags: body.tags || [],
      dependencies: body.dependencies || [],
      blockedBy: body.blockedBy || [],
      subtasks: body.subtasks || [],
      attachments: body.attachments || [],
      relatedDocuments: body.relatedDocuments || [],
      timeEntries: body.timeEntries || []
    })
    
    await task.save()
    
    // Populate references for response
    await task.populate([
      { path: 'projectId', select: 'name' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'assignedBy', select: 'firstName lastName' },
      { path: 'createdBy', select: 'firstName lastName' },
      { path: 'dependencies', select: 'title' },
      { path: 'blockedBy', select: 'title' },
      { path: 'subtasks', select: 'title' },
      { path: 'parentTask', select: 'title' }
    ])
    
    // Log the action
    await logAction(
      user._id.toString(),
      'TASK_CREATED',
      'TASK',
      'create',
      { 
        taskId: task._id,
        title: task.title,
        projectId: task.projectId,
        taskType: task.taskType
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    )
    
    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task
    })
    
  } catch (error) {
    console.error('Create task error:', error)
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
    
    // Check if user has permission to view tasks
    if (!hasPermission(user, 'tasks:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const taskType = searchParams.get('taskType') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const complexity = searchParams.get('complexity') || ''
    const projectId = searchParams.get('projectId') || ''
    const assignedTo = searchParams.get('assignedTo') || ''
    const dueDate = searchParams.get('dueDate') || ''
    const overdue = searchParams.get('overdue') || ''
    
    // Build query
    const query: any = { firmId: user.firmId }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (taskType) {
      query.taskType = taskType
    }
    
    if (status) {
      query.status = status
    }
    
    if (priority) {
      query.priority = priority
    }
    
    if (complexity) {
      query.complexity = complexity
    }
    
    if (projectId) {
      query.projectId = projectId
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo
    }
    
    if (dueDate) {
      query.dueDate = { $lte: new Date(dueDate) }
    }
    
    if (overdue === 'true') {
      query.$and = [
        { dueDate: { $lt: new Date() } },
        { status: { $nin: ['completed', 'cancelled'] } }
      ]
    }
    
    // Get total count
    const total = await Task.countDocuments(query)
    
    // Get tasks with pagination
    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('assignedTo', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName')
      .populate('dependencies', 'title')
      .populate('blockedBy', 'title')
      .populate('subtasks', 'title')
      .populate('parentTask', 'title')
      .sort({ dueDate: 1, priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
