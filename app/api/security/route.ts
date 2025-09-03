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
    
    // Check if user has permission to view security data
    if (!hasPermission(user, 'security:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const metric = searchParams.get('metric') || 'overview'
    
    // Mock security data - replace with actual database queries
    const securityData = {
      overview: {
        overallScore: 87,
        lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        vulnerabilities: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 8
        },
        compliance: {
          gdpr: true,
          sox: true,
          pci: false,
          iso27001: true
        },
        accessControl: {
          totalUsers: 24,
          activeSessions: 18,
          failedLogins: 3,
          mfaEnabled: 22
        },
        dataProtection: {
          encryptedData: 100,
          backupStatus: true,
          retentionPolicy: true,
          auditLogging: true
        }
      },
      policies: [
        {
          id: '1',
          name: 'Password Policy',
          description: 'Enforce strong password requirements and regular rotation',
          category: 'authentication',
          status: 'enabled',
          severity: 'high',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          compliance: ['GDPR', 'SOX', 'ISO27001']
        },
        {
          id: '2',
          name: 'Multi-Factor Authentication',
          description: 'Require MFA for all user accounts',
          category: 'authentication',
          status: 'enabled',
          severity: 'critical',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
          compliance: ['GDPR', 'SOX', 'PCI DSS', 'ISO27001']
        }
      ],
      events: [
        {
          id: '1',
          type: 'login',
          severity: 'low',
          description: 'Successful login from new IP address (192.168.1.100)',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          user: 'john.doe@firm.com',
          ip: '192.168.1.100',
          status: 'resolved'
        },
        {
          id: '2',
          type: 'security_alert',
          severity: 'high',
          description: 'Multiple failed login attempts detected',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          ip: '203.45.67.89',
          status: 'investigating'
        }
      ]
    }
    
    // Return data based on requested metric
    if (metric === 'overview') {
      return NextResponse.json({
        success: true,
        data: securityData.overview
      })
    } else if (metric === 'policies') {
      return NextResponse.json({
        success: true,
        data: securityData.policies
      })
    } else if (metric === 'events') {
      return NextResponse.json({
        success: true,
        data: securityData.events
      })
    } else {
      return NextResponse.json({
        success: true,
        data: securityData
      })
    }
    
  } catch (error) {
    console.error('Get security data error:', error)
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
    
    // Check if user has permission to update security settings
    if (!hasPermission(user, 'security:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.action || !body.data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Handle different security actions
    switch (body.action) {
      case 'update_policy':
        // Update security policy
        break
      case 'update_setting':
        // Update security setting
        break
      case 'run_scan':
        // Run security scan
        break
      case 'generate_report':
        // Generate security report
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    // Log the action
    await logAction(
      user._id.toString(),
      `SECURITY_${body.action.toUpperCase()}`,
      'SECURITY',
      'update',
      { 
        action: body.action,
        data: body.data
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    )
    
    return NextResponse.json({
      success: true,
      message: `Security ${body.action} completed successfully`
    })
    
  } catch (error) {
    console.error('Update security error:', error)
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
    
    // Check if user has permission to update security settings
    if (!hasPermission(user, 'security:update')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.policyId || !body.updates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Update security policy
    // In a real implementation, you would update the database here
    
    // Log the action
    await logAction(
      user._id.toString(),
      'SECURITY_POLICY_UPDATED',
      'SECURITY',
      'update',
      { 
        policyId: body.policyId,
        updates: body.updates
      },
      user.firmId.toString(),
      req.ip,
      req.headers.get('user-agent')
    )
    
    return NextResponse.json({
      success: true,
      message: 'Security policy updated successfully'
    })
    
  } catch (error) {
    console.error('Update security policy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
