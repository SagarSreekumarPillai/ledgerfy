import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission, logAction } from '@/lib/rbac'
import dbConnect from '@/lib/db'

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
    
    // Check if user has permission to create reports
    if (!hasPermission(user, 'reports:create')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.type || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Simulate report generation
    const reportData = {
      id: `report_${Date.now()}`,
      name: body.name,
      description: body.description || '',
      type: body.type,
      category: body.category,
      format: body.format || 'pdf',
      status: 'generating',
      lastGenerated: new Date(),
      nextScheduled: body.schedule ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) : undefined,
      downloadUrl: `/reports/${body.type}-${Date.now()}.${body.format}`,
      size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9) + 1} MB`
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      'REPORT_GENERATED',
      'REPORT',
      'create',
      { 
        reportId: reportData.id,
        name: reportData.name,
        type: reportData.type,
        category: reportData.category
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent') || undefined
    )
    
    return NextResponse.json({
      success: true,
      message: 'Report generation started',
      report: reportData
    })
    
  } catch (error) {
    console.error('Generate report error:', error)
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
    
    // Check if user has permission to view reports
    if (!hasPermission(user, 'reports:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    
    // Mock reports data - replace with actual database query
    const mockReports = [
      {
        id: '1',
        name: 'Revenue Analysis Report',
        description: 'Comprehensive analysis of firm revenue, client billing, and financial performance',
        type: 'financial',
        category: 'Revenue',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24),
        nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        status: 'available',
        format: 'pdf',
        size: '2.4 MB',
        downloadUrl: '/reports/revenue-analysis.pdf'
      },
      {
        id: '2',
        name: 'Compliance Status Report',
        description: 'Overview of all compliance items, deadlines, and completion status',
        type: 'compliance',
        category: 'Compliance',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 6),
        nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24),
        status: 'available',
        format: 'excel',
        size: '1.8 MB',
        downloadUrl: '/reports/compliance-status.xlsx'
      },
      {
        id: '3',
        name: 'Client Performance Report',
        description: 'Client engagement metrics, satisfaction scores, and relationship health',
        type: 'client',
        category: 'Client Relations',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        status: 'available',
        format: 'pdf',
        size: '3.1 MB',
        downloadUrl: '/reports/client-performance.pdf'
      }
    ]
    
    // Filter reports based on query parameters
    let filteredReports = mockReports
    
    if (type) {
      filteredReports = filteredReports.filter(report => report.type === type)
    }
    
    if (category) {
      filteredReports = filteredReports.filter(report => report.category === category)
    }
    
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status)
    }
    
    // Pagination
    const total = filteredReports.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReports = filteredReports.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      reports: paginatedReports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
