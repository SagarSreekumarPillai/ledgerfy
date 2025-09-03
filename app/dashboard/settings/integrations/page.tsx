'use client'

import { useState } from 'react'
import { 
  Link, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2,
  ExternalLink,
  Database,
  Shield,
  Zap,
  CreditCard,
  FileText,
  Calendar,
  Users,
  BarChart3,
  Globe,
  Key,
  Eye,
  EyeOff
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Integration {
  id: string
  name: string
  category: 'accounting' | 'banking' | 'tax' | 'communication' | 'productivity' | 'security'
  description: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync?: Date
  nextSync?: Date
  apiKey?: string
  endpoint?: string
  isEnabled: boolean
  version: string
  provider: string
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  lastError?: string
  syncStatus: 'success' | 'failed' | 'in-progress' | 'pending'
}

interface IntegrationCategory {
  name: string
  description: string
  icon: React.ReactNode
  count: number
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null)

  // Mock data
  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Tally Prime',
      category: 'accounting',
      description: 'Seamless integration with Tally Prime for ledger and voucher data',
      status: 'active',
      lastSync: new Date('2024-01-20T10:30:00'),
      nextSync: new Date('2024-01-20T11:30:00'),
      apiKey: 'tally_xyz_123456',
      endpoint: 'https://api.tally.com/v1',
      isEnabled: true,
      version: '2.1.0',
      provider: 'Tally Solutions',
      syncFrequency: 'hourly',
      syncStatus: 'success'
    },
    {
      id: '2',
      name: 'HDFC Bank API',
      category: 'banking',
      description: 'Direct bank integration for real-time transaction data',
      status: 'active',
      lastSync: new Date('2024-01-20T09:15:00'),
      nextSync: new Date('2024-01-20T10:15:00'),
      apiKey: 'hdfc_abc_789012',
      endpoint: 'https://api.hdfcbank.com/v2',
      isEnabled: true,
      version: '1.5.2',
      provider: 'HDFC Bank',
      syncFrequency: 'realtime',
      syncStatus: 'success'
    },
    {
      id: '3',
      name: 'GST Portal',
      category: 'tax',
      description: 'Government GST portal integration for tax filing',
      status: 'active',
      lastSync: new Date('2024-01-19T16:00:00'),
      nextSync: new Date('2024-01-20T16:00:00'),
      apiKey: 'gst_gov_456789',
      endpoint: 'https://api.gst.gov.in/v1',
      isEnabled: true,
      version: '3.0.1',
      provider: 'Government of India',
      syncFrequency: 'daily',
      syncStatus: 'success'
    },
    {
      id: '4',
      name: 'Slack',
      category: 'communication',
      description: 'Team communication and notification integration',
      status: 'inactive',
      lastSync: new Date('2024-01-15T14:30:00'),
      apiKey: 'slack_xyz_123789',
      endpoint: 'https://slack.com/api',
      isEnabled: false,
      version: '2.0.0',
      provider: 'Slack Technologies',
      syncFrequency: 'realtime',
      syncStatus: 'pending'
    },
    {
      id: '5',
      name: 'Google Workspace',
      category: 'productivity',
      description: 'Google Drive and Calendar integration',
      status: 'error',
      lastSync: new Date('2024-01-18T12:00:00'),
      lastError: 'Authentication token expired',
      apiKey: 'google_abc_456123',
      endpoint: 'https://www.googleapis.com',
      isEnabled: true,
      version: '1.8.5',
      provider: 'Google',
      syncFrequency: 'hourly',
      syncStatus: 'failed'
    }
  ]

  const categories: IntegrationCategory[] = [
    {
      name: 'Accounting',
      description: 'Tally, QuickBooks, and other accounting software',
      icon: <Database className="h-6 w-6" />,
      count: integrations.filter(i => i.category === 'accounting').length
    },
    {
      name: 'Banking',
      description: 'Bank APIs and financial institutions',
      icon: <CreditCard className="h-6 w-6" />,
      count: integrations.filter(i => i.category === 'banking').length
    },
    {
      name: 'Tax',
      description: 'Government portals and tax filing systems',
      icon: <FileText className="h-6 w-6" />,
      count: integrations.filter(i => i.category === 'tax').length
    },
    {
      name: 'Communication',
      description: 'Team collaboration and messaging tools',
      icon: <Users className="h-6 w-6" />,
      count: integrations.filter(i => i.category === 'communication').length
    },
    {
      name: 'Productivity',
      description: 'Office and productivity applications',
      icon: <BarChart3 className="h-6 w-6" />,
      count: integrations.filter(i => i.category === 'productivity').length
    },
    {
      name: 'Security',
      description: 'Authentication and security services',
      icon: <Shield className="h-6 w-6" />,
      count: integrations.filter(i => i.category === 'security').length
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accounting':
        return <Database className="h-5 w-5" />
      case 'banking':
        return <CreditCard className="h-5 w-5" />
      case 'tax':
        return <FileText className="h-5 w-5" />
      case 'communication':
        return <Users className="h-5 w-5" />
      case 'productivity':
        return <BarChart3 className="h-5 w-5" />
      case 'security':
        return <Shield className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'in-progress':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Integrations"
        description="Connect with third-party services and applications"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Integrations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{integrations.length}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {integrations.filter(i => i.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Errors</p>
                  <p className="text-2xl font-bold text-red-600">
                    {integrations.filter(i => i.status === 'error').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Sync</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {integrations.filter(i => i.lastSync).length > 0 ? 
                      formatDate(integrations.filter(i => i.lastSync)[0].lastSync!) : 'Never'}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Category Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{category.count}</span>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Integration Activity</CardTitle>
                <CardDescription>Latest syncs and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.slice(0, 5).map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          {getCategoryIcon(integration.category)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{integration.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {integration.provider} • {integration.version}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getSyncStatusColor(integration.syncStatus)}>
                          {integration.syncStatus}
                        </Badge>
                        {integration.lastSync && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(integration.lastSync)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Manage Integrations</CardTitle>
                    <CardDescription>Configure and monitor all third-party integrations</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="accounting">Accounting</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="tax">Tax</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            {getCategoryIcon(integration.category)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {integration.name}
                              </h3>
                              <Badge className={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                              <Badge variant="outline">{integration.category}</Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{integration.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>Provider: {integration.provider}</span>
                              <span>Version: {integration.version}</span>
                              <span>Sync: {integration.syncFrequency}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={integration.isEnabled}
                            onCheckedChange={() => {}}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </Button>
                        </div>
                      </div>

                      {/* Integration Details */}
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              API Endpoint
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                value={integration.endpoint || ''}
                                readOnly
                                className="text-sm"
                              />
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              API Key
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                type={showApiKey[integration.id] ? 'text' : 'password'}
                                value={integration.apiKey || ''}
                                readOnly
                                className="text-sm"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleApiKeyVisibility(integration.id)}
                              >
                                {showApiKey[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Sync Status
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              {getSyncStatusIcon(integration.syncStatus)}
                              <Badge className={getSyncStatusColor(integration.syncStatus)}>
                                {integration.syncStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Sync Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Last Sync
                            </Label>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">
                              {integration.lastSync ? formatDate(integration.lastSync) : 'Never'}
                            </p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Next Sync
                            </Label>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">
                              {integration.nextSync ? formatDate(integration.nextSync) : 'Not scheduled'}
                            </p>
                          </div>
                        </div>

                        {/* Error Display */}
                        {integration.lastError && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800 dark:text-red-200">Last Error:</span>
                            </div>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{integration.lastError}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Global Integration Settings</CardTitle>
                  <CardDescription>Configure default behavior for all integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-sync on startup
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically sync all active integrations when the application starts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Error notifications
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Send notifications when integrations encounter errors
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Retry failed syncs
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically retry failed synchronization attempts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Log all API calls
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Maintain detailed logs of all API interactions for debugging
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Manage API keys and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Encrypt API keys
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Store API keys in encrypted format
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Audit logging
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Log all integration access and changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        IP restrictions
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Restrict API access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Two-factor auth for APIs
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require 2FA for sensitive API operations
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
                <CardDescription>Advanced integration settings and customization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Sync Intervals</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Real-time</span>
                        <Badge variant="outline">5 min</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Hourly</span>
                        <Badge variant="outline">60 min</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Daily</span>
                        <Badge variant="outline">24 hours</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Retry Policy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Max retries</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Retry delay</span>
                        <Badge variant="outline">5 min</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Backoff</span>
                        <Badge variant="outline">Exponential</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Rate Limiting</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Requests/min</span>
                        <Badge variant="outline">100</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Burst limit</span>
                        <Badge variant="outline">200</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Queue size</span>
                        <Badge variant="outline">1000</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
