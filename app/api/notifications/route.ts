import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission, logAction } from '@/lib/rbac'
import dbConnect from '@/lib/db'

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
    
    // Check if user has permission to view notifications
    if (!hasPermission(user, 'notifications:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const filter = searchParams.get('filter') || 'all'
    const category = searchParams.get('category') || ''
    
    // Mock notifications data - replace with actual database query
    const mockNotifications = [
      {
        id: '1',
        title: 'GST Return Due Soon',
        message: 'GST return for ABC Corporation is due in 3 days',
        type: 'reminder',
        priority: 'high',
        category: 'compliance',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        actionUrl: '/dashboard/compliance',
        metadata: { clientId: 'abc123', dueDate: '2024-01-25' }
      },
      {
        id: '2',
        title: 'Project Milestone Completed',
        message: 'Tax Planning project milestone "Review Calculations" has been completed',
        type: 'success',
        priority: 'medium',
        category: 'project',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        actionUrl: '/dashboard/projects',
        metadata: { projectId: 'tax123', milestone: 'Review Calculations' }
      },
      {
        id: '3',
        title: 'New Client Registration',
        message: 'XYZ Limited has been registered as a new client',
        type: 'info',
        priority: 'low',
        category: 'client',
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        actionUrl: '/dashboard/clients',
        metadata: { clientId: 'xyz456', clientName: 'XYZ Limited' }
      },
      {
        id: '4',
        title: 'System Maintenance',
        message: 'Scheduled system maintenance will occur tonight at 2:00 AM',
        type: 'warning',
        priority: 'medium',
        category: 'system',
        isRead: true,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        metadata: { maintenanceTime: '02:00 AM', duration: '2 hours' }
      },
      {
        id: '5',
        title: 'Critical Compliance Alert',
        message: 'TDS return for DEF Industries is overdue by 2 days',
        type: 'error',
        priority: 'critical',
        category: 'compliance',
        isRead: false,
        isArchived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        actionUrl: '/dashboard/compliance',
        metadata: { clientId: 'def789', overdueDays: 2 }
      }
    ]
    
    // Filter notifications based on query parameters
    let filteredNotifications = mockNotifications
    
    if (filter === 'unread') {
      filteredNotifications = filteredNotifications.filter(notif => !notif.isRead)
    } else if (filter === 'critical') {
      filteredNotifications = filteredNotifications.filter(notif => notif.priority === 'critical')
    } else if (filter === 'compliance') {
      filteredNotifications = filteredNotifications.filter(notif => notif.category === 'compliance')
    }
    
    if (category) {
      filteredNotifications = filteredNotifications.filter(notif => notif.category === category)
    }
    
    // Remove archived notifications
    filteredNotifications = filteredNotifications.filter(notif => !notif.isArchived)
    
    // Sort by creation date (newest first)
    filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    // Pagination
    const total = filteredNotifications.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      notifications: paginatedNotifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    
    const user = await getServerUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await req.json()
    const { action, notificationIds } = body
    
    if (!action || !notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
    // Check permissions based on action
    if (action === 'mark_read' && !hasPermission(user, 'notifications:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    if (action === 'archive' && !hasPermission(user, 'notifications:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    if (action === 'delete' && !hasPermission(user, 'notifications:delete')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      `NOTIFICATION_${action.toUpperCase()}`,
      'NOTIFICATION',
      'update',
      { 
        action,
        notificationIds,
        count: notificationIds.length
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    )
    
    // In a real implementation, you would update the database here
    // For now, we'll return a success response
    
    return NextResponse.json({
      success: true,
      message: `Notifications ${action.replace('_', ' ')} successfully`,
      updatedCount: notificationIds.length
    })
    
  } catch (error) {
    console.error('Update notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    
    // Check if user has permission to create notifications
    if (!hasPermission(user, 'notifications:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.title || !body.message || !body.type || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create notification
    const notificationData = {
      id: `notif_${Date.now()}`,
      title: body.title,
      message: body.message,
      type: body.type,
      priority: body.priority || 'medium',
      category: body.category,
      isRead: false,
      isArchived: false,
      createdAt: new Date(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      actionUrl: body.actionUrl,
      metadata: body.metadata || {}
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'NOTIFICATION_CREATED',
      'NOTIFICATION',
      'create',
      { 
        notificationId: notificationData.id,
        title: notificationData.title,
        type: notificationData.type,
        category: notificationData.category
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    )
    
    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      notification: notificationData
    })
    
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
