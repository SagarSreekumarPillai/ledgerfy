'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock,
  Key,
  Users,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SecurityMetrics {
  overallScore: number
  lastAssessment: Date
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  compliance: {
    gdpr: boolean
    sox: boolean
    pci: boolean
    iso27001: boolean
  }
  accessControl: {
    totalUsers: number
    activeSessions: number
    failedLogins: number
    mfaEnabled: number
  }
  dataProtection: {
    encryptedData: number
    backupStatus: boolean
    retentionPolicy: boolean
    auditLogging: boolean
  }
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'permission_change' | 'data_access' | 'system_change' | 'security_alert'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date
  user?: string
  ip?: string
  status: 'resolved' | 'investigating' | 'open'
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call for security data
    setTimeout(() => {
      setMetrics({
        overallScore: 87,
        lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
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
      })

      setRecentEvents([
        {
          id: '1',
          type: 'login',
          severity: 'low',
          description: 'Successful login from new IP address (192.168.1.100)',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          user: 'john.doe@firm.com',
          ip: '192.168.1.100',
          status: 'resolved'
        },
        {
          id: '2',
          type: 'permission_change',
          severity: 'medium',
          description: 'User role changed from Associate to Senior',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          user: 'jane.smith@firm.com',
          status: 'resolved'
        },
        {
          id: '3',
          type: 'security_alert',
          severity: 'high',
          description: 'Multiple failed login attempts detected',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          ip: '203.45.67.89',
          status: 'investigating'
        },
        {
          id: '4',
          type: 'data_access',
          severity: 'low',
          description: 'Bulk document download initiated',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          user: 'admin@firm.com',
          status: 'resolved'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 80) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 70) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getSecurityScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400'
    if (score >= 70) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Key className="h-4 w-4 text-blue-600" />
      case 'logout':
        return <Lock className="h-4 w-4 text-gray-600" />
      case 'permission_change':
        return <Users className="h-4 w-4 text-purple-600" />
      case 'data_access':
        return <Eye className="h-4 w-4 text-green-600" />
      case 'system_change':
        return <Activity className="h-4 w-4 text-orange-600" />
      case 'security_alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      investigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.open
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading security data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Security Overview</span>
          </CardTitle>
          <CardDescription>
            Overall security posture and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Security Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - metrics.overallScore / 100)}`}
                    className={getSecurityScoreColor(metrics.overallScore)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn("text-2xl font-bold", getSecurityScoreColor(metrics.overallScore))}>
                    {metrics.overallScore}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Security Score</p>
              <Badge className={cn("mt-2", getSecurityScoreBadge(metrics.overallScore))}>
                {metrics.overallScore >= 90 ? 'Excellent' : 
                 metrics.overallScore >= 80 ? 'Good' : 
                 metrics.overallScore >= 70 ? 'Fair' : 'Poor'}
              </Badge>
            </div>

            {/* Vulnerabilities */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Vulnerabilities</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                  <Badge variant="destructive">{metrics.vulnerabilities.critical}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {metrics.vulnerabilities.high}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {metrics.vulnerabilities.medium}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {metrics.vulnerabilities.low}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Compliance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">GDPR</span>
                  {metrics.compliance.gdpr ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">SOX</span>
                  {metrics.compliance.sox ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">PCI DSS</span>
                  {metrics.compliance.pci ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ISO 27001</span>
                  {metrics.compliance.iso27001 ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Control & Data Protection */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
            <CardDescription>
              User access and authentication metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.accessControl.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.accessControl.activeSessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Failed Logins (24h)</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.accessControl.failedLogins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">MFA Enabled</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.accessControl.mfaEnabled}/{metrics.accessControl.totalUsers}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(metrics.accessControl.mfaEnabled / metrics.accessControl.totalUsers) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Protection</CardTitle>
            <CardDescription>
              Data security and backup status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Encryption</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.dataProtection.encryptedData}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Backup Status</span>
                {metrics.dataProtection.backupStatus ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Retention Policy</span>
                {metrics.dataProtection.retentionPolicy ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Audit Logging</span>
                {metrics.dataProtection.auditLogging ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <XCircle className="h-4 w-4 text-red-600" />
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security activities and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0 mt-1">
                  {getEventTypeIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.description}
                    </p>
                    <Badge className={cn("text-xs", getSeverityColor(event.severity))}>
                      {event.severity}
                    </Badge>
                    <Badge className={cn("text-xs", getStatusColor(event.status))}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatTimeAgo(event.timestamp)}</span>
                    {event.user && <span>User: {event.user}</span>}
                    {event.ip && <span>IP: {event.ip}</span>}
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
          <CardDescription>
            Quick actions to improve security posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Run Security Scan</span>
              <span className="text-xs text-gray-500">Scan for vulnerabilities</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium">Review Access</span>
              <span className="text-xs text-gray-500">Audit user permissions</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Lock className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Update Policies</span>
              <span className="text-xs text-gray-500">Security policy review</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Generate Report</span>
              <span className="text-xs text-gray-500">Security assessment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
