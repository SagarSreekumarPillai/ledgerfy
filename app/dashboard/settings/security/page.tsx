'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Key, 
  Users, 
  Eye, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Save,
  RefreshCw
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { SecurityDashboard } from '@/components/security/SecurityDashboard'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface SecurityPolicy {
  id: string
  name: string
  description: string
  category: 'authentication' | 'authorization' | 'data_protection' | 'audit' | 'compliance'
  status: 'enabled' | 'disabled' | 'warning'
  severity: 'low' | 'medium' | 'high' | 'critical'
  lastUpdated: Date
  nextReview: Date
  compliance: string[]
}

interface SecuritySetting {
  id: string
  name: string
  description: string
  value: boolean | string | number
  type: 'boolean' | 'string' | 'number' | 'select'
  options?: string[]
  category: string
  requiresRestart: boolean
}

export default function SecuritySettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'settings' | 'compliance'>('overview')
  const [policies, setPolicies] = useState<SecurityPolicy[]>([])
  const [settings, setSettings] = useState<SecuritySetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPolicies([
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
        },
        {
          id: '3',
          name: 'Session Management',
          description: 'Automatic session timeout and concurrent session limits',
          category: 'authorization',
          status: 'enabled',
          severity: 'medium',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
          compliance: ['GDPR', 'SOX', 'ISO27001']
        },
        {
          id: '4',
          name: 'Data Encryption',
          description: 'Encrypt data at rest and in transit',
          category: 'data_protection',
          status: 'enabled',
          severity: 'critical',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
          compliance: ['GDPR', 'SOX', 'PCI DSS', 'ISO27001']
        },
        {
          id: '5',
          name: 'Audit Logging',
          description: 'Comprehensive logging of all security events',
          category: 'audit',
          status: 'enabled',
          severity: 'high',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          compliance: ['GDPR', 'SOX', 'ISO27001']
        },
        {
          id: '6',
          name: 'Access Control',
          description: 'Role-based access control with least privilege principle',
          category: 'authorization',
          status: 'enabled',
          severity: 'high',
          lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          compliance: ['GDPR', 'SOX', 'ISO27001']
        }
      ])

      setSettings([
        {
          id: '1',
          name: 'Password Minimum Length',
          description: 'Minimum number of characters required for passwords',
          value: 12,
          type: 'number',
          category: 'authentication',
          requiresRestart: false
        },
        {
          id: '2',
          name: 'Password Complexity',
          description: 'Require passwords to contain uppercase, lowercase, numbers, and symbols',
          value: true,
          type: 'boolean',
          category: 'authentication',
          requiresRestart: false
        },
        {
          id: '3',
          name: 'Password Expiry Days',
          description: 'Number of days before passwords must be changed',
          value: 90,
          type: 'number',
          category: 'authentication',
          requiresRestart: false
        },
        {
          id: '4',
          name: 'Session Timeout (minutes)',
          description: 'Automatic logout after inactivity',
          value: 30,
          type: 'number',
          category: 'authorization',
          requiresRestart: false
        },
        {
          id: '5',
          name: 'Max Concurrent Sessions',
          description: 'Maximum number of active sessions per user',
          value: 3,
          type: 'number',
          category: 'authorization',
          requiresRestart: false
        },
        {
          id: '6',
          name: 'Enable IP Whitelisting',
          description: 'Restrict access to specific IP addresses',
          value: false,
          type: 'boolean',
          category: 'authorization',
          requiresRestart: true
        },
        {
          id: '7',
          name: 'Data Retention Period (days)',
          description: 'How long to retain audit logs and user data',
          value: 2555,
          type: 'number',
          category: 'data_protection',
          requiresRestart: false
        },
        {
          id: '8',
          name: 'Enable Data Backup',
          description: 'Automatically backup critical data',
          value: true,
          type: 'boolean',
          category: 'data_protection',
          requiresRestart: false
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const updateSetting = (id: string, value: boolean | string | number) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    )
  }

  const saveSettings = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      // Show success message
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      enabled: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      disabled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
    return colors[status as keyof typeof colors] || colors.disabled
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Key className="h-4 w-4 text-blue-600" />
      case 'authorization':
        return <Lock className="h-4 w-4 text-green-600" />
      case 'data_protection':
        return <Shield className="h-4 w-4 text-purple-600" />
      case 'audit':
        return <Eye className="h-4 w-4 text-orange-600" />
      case 'compliance':
        return <CheckCircle className="h-4 w-4 text-indigo-600" />
      default:
        return <Settings className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Security Settings"
          description="Manage security policies and configurations"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading security settings...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Settings"
        description="Manage security policies and configurations"
      >
        <PageHeaderActions>
          <RequirePermission permission="security:update">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </RequirePermission>
        </PageHeaderActions>
      </PageHeader>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: Shield },
            { id: 'policies', name: 'Security Policies', icon: Lock },
            { id: 'settings', name: 'Settings', icon: Settings },
            { id: 'compliance', name: 'Compliance', icon: CheckCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <SecurityDashboard />
      )}

      {activeTab === 'policies' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Manage and review security policies and their compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(policy.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {policy.name}
                        </h4>
                        <Badge className={cn("text-xs", getStatusColor(policy.status))}>
                          {policy.status}
                        </Badge>
                        <Badge className={cn("text-xs", getSeverityColor(policy.severity))}>
                          {policy.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {policy.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Last Updated: {formatDate(policy.lastUpdated)}</span>
                        <span>Next Review: {formatDate(policy.nextReview)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {policy.compliance.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Configure security settings and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['authentication', 'authorization', 'data_protection'].map((category) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                      {category.replace('_', ' ')}
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {settings
                        .filter(setting => setting.category === category)
                        .map((setting) => (
                          <div key={setting.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {setting.name}
                              </h4>
                              {setting.requiresRestart && (
                                <Badge variant="outline" className="text-xs">
                                  Restart Required
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {setting.description}
                            </p>
                            
                            <div className="flex items-center space-x-2">
                              {setting.type === 'boolean' && (
                                <Button
                                  variant={setting.value ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => updateSetting(setting.id, !setting.value)}
                                >
                                  {setting.value ? 'Enabled' : 'Disabled'}
                                </Button>
                              )}
                              
                              {setting.type === 'number' && (
                                <input
                                  type="number"
                                  value={setting.value as number}
                                  onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                              
                              {setting.type === 'select' && setting.options && (
                                <select
                                  value={setting.value as string}
                                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {setting.options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>
                Overview of compliance with various security standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'GDPR', status: true, description: 'General Data Protection Regulation' },
                  { name: 'SOX', status: true, description: 'Sarbanes-Oxley Act' },
                  { name: 'PCI DSS', status: false, description: 'Payment Card Industry Data Security Standard' },
                  { name: 'ISO 27001', status: true, description: 'Information Security Management System' }
                ].map((standard) => (
                  <div key={standard.name} className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="mb-3">
                      {standard.status ? 
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" /> : 
                        <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                      }
                    </div>
                    
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {standard.name}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {standard.description}
                    </p>
                    
                    <Badge className={standard.status ? 
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }>
                      {standard.status ? 'Compliant' : 'Non-Compliant'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
