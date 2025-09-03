import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission } from '@/lib/rbac'
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

    // Check if user has permission to view analytics
    if (!hasPermission(user, 'analytics:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const metric = searchParams.get('metric') || 'overview'
    const timeRange = searchParams.get('timeRange') || '30d'
    const category = searchParams.get('category') || 'all'

    // Mock analytics data - replace with actual database queries
    const mockAnalyticsData = {
      overview: {
        revenue: {
          current: 1250000,
          previous: 1180000,
          change: 5.93,
          trend: 'up',
          target: 8.0
        },
        clients: {
          total: 156,
          active: 142,
          new: 12,
          churn: 3,
          retention: 94.2,
          target: 95.0
        },
        projects: {
          total: 89,
          active: 34,
          completed: 52,
          delayed: 3,
          deliveryTime: 12.5,
          target: 10.0
        },
        compliance: {
          total: 234,
          completed: 198,
          pending: 28,
          overdue: 8,
          rate: 98.7,
          target: 99.0
        },
        performance: {
          utilization: 87.5,
          efficiency: 92.3,
          quality: 94.8,
          satisfaction: 96.2,
          targets: {
            utilization: 90.0,
            efficiency: 95.0,
            quality: 95.0,
            satisfaction: 95.0
          }
        }
      },
      kpis: [
        {
          id: 'kpi_1',
          name: 'Revenue Growth Rate',
          value: 5.93,
          target: 8.0,
          unit: '%',
          trend: 'up',
          change: 2.1,
          status: 'at-risk',
          category: 'financial'
        },
        {
          id: 'kpi_2',
          name: 'Client Retention Rate',
          value: 94.2,
          target: 95.0,
          unit: '%',
          trend: 'up',
          change: 1.8,
          status: 'on-track',
          category: 'client'
        },
        {
          id: 'kpi_3',
          name: 'Project Delivery Time',
          value: 12.5,
          target: 10.0,
          unit: 'days',
          trend: 'down',
          change: -2.5,
          status: 'behind',
          category: 'operational'
        },
        {
          id: 'kpi_4',
          name: 'Compliance Rate',
          value: 98.7,
          target: 99.0,
          unit: '%',
          trend: 'up',
          change: 0.5,
          status: 'on-track',
          category: 'compliance'
        },
        {
          id: 'kpi_5',
          name: 'Team Utilization',
          value: 87.5,
          target: 90.0,
          unit: '%',
          trend: 'up',
          change: 3.2,
          status: 'at-risk',
          category: 'operational'
        },
        {
          id: 'kpi_6',
          name: 'Profit Margin',
          value: 28.3,
          target: 30.0,
          unit: '%',
          trend: 'up',
          change: 1.8,
          status: 'at-risk',
          category: 'financial'
        }
      ],
      insights: [
        {
          id: 'insight_1',
          title: 'Revenue growth below target',
          description: 'Current revenue growth rate of 5.93% is below the target of 8.0%. Consider reviewing pricing strategies and client acquisition efforts.',
          type: 'risk',
          priority: 'high',
          impact: 'high',
          category: 'financial',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actionable: true
        },
        {
          id: 'insight_2',
          title: 'Client retention improving',
          description: 'Client retention rate has improved by 1.8% to 94.2%, approaching the target of 95.0%. Continue focusing on client satisfaction.',
          type: 'trend',
          priority: 'medium',
          impact: 'medium',
          category: 'client',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          actionable: false
        },
        {
          id: 'insight_3',
          title: 'Project delivery delays',
          description: 'Average project delivery time is 12.5 days, 2.5 days behind target. Review project management processes and resource allocation.',
          type: 'risk',
          priority: 'high',
          impact: 'high',
          category: 'operational',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          actionable: true
        },
        {
          id: 'insight_4',
          title: 'Team utilization opportunity',
          description: 'Team utilization has improved to 87.5% but remains below the 90.0% target. Consider workload balancing and skill development.',
          type: 'opportunity',
          priority: 'medium',
          impact: 'medium',
          category: 'operational',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          actionable: true
        }
      ],
      forecasts: [
        {
          metric: 'Revenue',
          current: 1250000,
          forecast: 1380000,
          confidence: 85,
          trend: 'up',
          factors: ['Client expansion', 'Service diversification', 'Market growth']
        },
        {
          metric: 'Client Base',
          current: 156,
          forecast: 172,
          confidence: 78,
          trend: 'up',
          factors: ['Referral programs', 'Digital marketing', 'Client retention']
        },
        {
          metric: 'Project Completion',
          current: 52,
          forecast: 58,
          confidence: 82,
          trend: 'up',
          factors: ['Process optimization', 'Team training', 'Resource allocation']
        },
        {
          metric: 'Compliance Rate',
          current: 98.7,
          forecast: 99.2,
          confidence: 90,
          trend: 'up',
          factors: ['Automated systems', 'Regular audits', 'Staff training']
        }
      ]
    }

    let data
    switch (metric) {
      case 'overview':
        data = mockAnalyticsData.overview
        break
      case 'kpis':
        data = category === 'all' 
          ? mockAnalyticsData.kpis 
          : mockAnalyticsData.kpis.filter(kpi => kpi.category === category)
        break
      case 'insights':
        data = category === 'all' 
          ? mockAnalyticsData.insights 
          : mockAnalyticsData.insights.filter(insight => insight.category === category)
        break
      case 'forecasts':
        data = mockAnalyticsData.forecasts
        break
      default:
        data = mockAnalyticsData.overview
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      timeRange,
      category
    })

  } catch (error) {
    console.error('Get analytics error:', error)
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

    // Check if user has permission to perform analytics actions
    if (!hasPermission(user, 'analytics:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { action, data } = body

    let result
    let message

    switch (action) {
      case 'create_kpi':
        // Simulate creating a new KPI
        result = {
          id: `kpi_${Date.now()}`,
          ...data,
          createdAt: new Date(),
          createdBy: user.email
        }
        message = 'KPI created successfully'
        break

      case 'update_kpi':
        // Simulate updating a KPI
        result = {
          ...data,
          updatedAt: new Date(),
          updatedBy: user.email
        }
        message = 'KPI updated successfully'
        break

      case 'generate_insight':
        // Simulate generating AI insights
        result = {
          id: `insight_${Date.now()}`,
          title: 'AI Generated Insight',
          description: 'This is a computer-generated business insight based on current data patterns.',
          type: 'trend',
          priority: 'medium',
          impact: 'medium',
          category: data.category || 'general',
          timestamp: new Date(),
          actionable: true,
          generatedBy: 'AI System'
        }
        message = 'AI insight generated successfully'
        break

      case 'export_data':
        // Simulate exporting analytics data
        result = {
          exportId: `export_${Date.now()}`,
          format: data.format || 'csv',
          status: 'completed',
          downloadUrl: `/api/analytics/export/${Date.now()}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
        message = 'Data export completed successfully'
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Log the analytics action
    // await AuditLog.create({
    //   userId: user._id,
    //   action: `analytics:${action}`,
    //   resource: 'analytics',
    //   details: { action, data },
    //   ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    //   userAgent: req.headers.get('user-agent')
    // })

    return NextResponse.json({
      success: true,
      message,
      data: result
    })

  } catch (error) {
    console.error('Analytics action error:', error)
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

    // Check if user has permission to update analytics
    if (!hasPermission(user, 'analytics:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { kpiId, insightId, action, updates } = body

    let result
    let message

    switch (action) {
      case 'update_kpi_target':
        // Simulate updating KPI target
        result = {
          kpiId,
          updated: true,
          target: updates.target,
          updatedAt: new Date(),
          updatedBy: user.email,
          message: 'KPI target updated successfully'
        }
        message = 'KPI target updated'
        break

      case 'acknowledge_insight':
        // Simulate acknowledging an insight
        result = {
          insightId,
          acknowledged: true,
          acknowledgedBy: user.email,
          acknowledgedAt: new Date(),
          message: 'Insight acknowledged successfully'
        }
        message = 'Insight acknowledged'
        break

      case 'update_forecast':
        // Simulate updating forecast
        result = {
          updated: true,
          forecast: updates,
          updatedAt: new Date(),
          updatedBy: user.email,
          message: 'Forecast updated successfully'
        }
        message = 'Forecast updated'
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Log the analytics update action
    // await AuditLog.create({
    //   userId: user._id,
    //   action: `analytics:update_${action}`,
    //   resource: 'analytics',
    //   details: { action, kpiId, insightId, updates },
    //   ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    //   userAgent: req.headers.get('user-agent')
    // })

    return NextResponse.json({
      success: true,
      message,
      data: result
    })

  } catch (error) {
    console.error('Analytics update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
