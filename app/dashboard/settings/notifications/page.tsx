'use client'

import { useState } from 'react'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Calendar,
  FileText,
  Users,
  Shield,
  Database,
  CreditCard,
  TrendingUp,
  Plus,
  Edit,
  Trash2
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
import { Textarea } from '@/components/ui/textarea'

interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'sms' | 'push' | 'slack' | 'webhook'
  description: string
  isEnabled: boolean
  isVerified: boolean
  lastUsed?: Date
  icon: React.ReactNode
}

interface NotificationPreference {
  id: string
  category: 'system' | 'compliance' | 'financial' | 'client' | 'security' | 'reminders'
  name: string
  description: string
  email: boolean
  sms: boolean
  push: boolean
  slack: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  isEnabled: boolean
}

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: string
  isActive: boolean
  lastModified: Date
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)

  // Mock data
  const notificationChannels: NotificationChannel[] = [
    {
      id: '1',
      name: 'Email Notifications',
      type: 'email',
      description: 'Receive notifications via email',
      isEnabled: true,
      isVerified: true,
      lastUsed: new Date('2024-01-20T10:30:00'),
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: '2',
      name: 'SMS Alerts',
      type: 'sms',
      description: 'Critical alerts via SMS',
      isEnabled: true,
      isVerified: true,
      lastUsed: new Date('2024-01-19T15:45:00'),
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: '3',
      name: 'Push Notifications',
      type: 'push',
      description: 'In-app and browser push notifications',
      isEnabled: true,
      isVerified: false,
      lastUsed: new Date('2024-01-20T09:15:00'),
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: '4',
      name: 'Slack Integration',
      type: 'slack',
      description: 'Team notifications via Slack',
      isEnabled: false,
      isVerified: false,
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: '5',
      name: 'Webhook Notifications',
      type: 'webhook',
      description: 'Custom webhook integrations',
      isEnabled: false,
      isVerified: false,
      icon: <Zap className="h-5 w-5" />
    }
  ]

  const notificationPreferences: NotificationPreference[] = [
    {
      id: '1',
      category: 'system',
      name: 'System Updates',
      description: 'Application updates and maintenance notifications',
      email: true,
      sms: false,
      push: true,
      slack: false,
      priority: 'low',
      isEnabled: true
    },
    {
      id: '2',
      category: 'compliance',
      name: 'Compliance Deadlines',
      description: 'Important compliance deadlines and reminders',
      email: true,
      sms: true,
      push: true,
      slack: true,
      priority: 'high',
      isEnabled: true
    },
    {
      id: '3',
      category: 'financial',
      name: 'Financial Alerts',
      description: 'Revenue, expense, and financial performance alerts',
      email: true,
      sms: false,
      push: true,
      slack: false,
      priority: 'medium',
      isEnabled: true
    },
    {
      id: '4',
      category: 'client',
      name: 'Client Communications',
      description: 'Client inquiries, document approvals, and updates',
      email: true,
      sms: false,
      push: true,
      slack: true,
      priority: 'medium',
      isEnabled: true
    },
    {
      id: '5',
      category: 'security',
      name: 'Security Alerts',
      description: 'Login attempts, suspicious activities, and security breaches',
      email: true,
      sms: true,
      push: true,
      slack: true,
      priority: 'critical',
      isEnabled: true
    },
    {
      id: '6',
      category: 'reminders',
      name: 'Task Reminders',
      description: 'Task deadlines, project milestones, and follow-ups',
      email: true,
      sms: false,
      push: true,
      slack: false,
      priority: 'medium',
      isEnabled: true
    }
  ]

  const notificationTemplates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Compliance Deadline Reminder',
      subject: 'Compliance Deadline Approaching - Action Required',
      body: 'Dear {recipient_name},\n\nThis is a reminder that {compliance_item} is due on {due_date}.\n\nPlease ensure all required documents are submitted and compliance requirements are met.\n\nBest regards,\nLedgerfy Team',
      category: 'compliance',
      isActive: true,
      lastModified: new Date('2024-01-15T14:30:00')
    },
    {
      id: '2',
      name: 'Document Approval Notification',
      subject: 'Document Approved - {document_name}',
      body: 'Hello {recipient_name},\n\nYour document "{document_name}" has been approved and is now available for download.\n\nDocument Details:\n- Type: {document_type}\n- Approved by: {approver_name}\n- Approval date: {approval_date}\n\nThank you for using Ledgerfy.',
      category: 'client',
      isActive: true,
      lastModified: new Date('2024-01-18T11:45:00')
    },
    {
      id: '3',
      name: 'Security Alert',
      subject: 'Security Alert - Unusual Login Activity',
      body: 'Security Alert for {account_name}\n\nWe detected unusual login activity from {location} at {timestamp}.\n\nIf this was you, no action is needed. If not, please secure your account immediately.\n\nDevice: {device_info}\nIP Address: {ip_address}',
      category: 'security',
      isActive: true,
      lastModified: new Date('2024-01-20T08:15:00')
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Settings className="h-5 w-5" />
      case 'compliance':
        return <FileText className="h-5 w-5" />
      case 'financial':
        return <TrendingUp className="h-5 w-5" />
      case 'client':
        return <Users className="h-5 w-5" />
      case 'security':
        return <Shield className="h-5 w-5" />
      case 'reminders':
        return <Calendar className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getChannelStatusColor = (isEnabled: boolean, isVerified: boolean) => {
    if (!isEnabled) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    if (!isVerified) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
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

  const getChannelCount = (type: string) => {
    return notificationChannels.filter(channel => channel.type === type).length
  }

  const getActiveChannelCount = () => {
    return notificationChannels.filter(channel => channel.isEnabled).length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Notification Settings"
        description="Configure how and when you receive notifications"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Test Notifications
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Channels</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getActiveChannelCount()}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-2xl font-bold text-green-600">
                    {getChannelCount('email')}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">SMS</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getChannelCount('sms')}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Templates</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {notificationTemplates.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Status of all notification delivery channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationChannels.map((channel) => (
                      <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            {channel.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{channel.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{channel.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getChannelStatusColor(channel.isEnabled, channel.isVerified)}>
                            {!channel.isEnabled ? 'Disabled' : !channel.isVerified ? 'Unverified' : 'Active'}
                          </Badge>
                          <Switch
                            checked={channel.isEnabled}
                            onCheckedChange={() => {}}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common notification management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Bell className="h-6 w-6" />
                      <span>Test All Channels</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      <span>Global Settings</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Eye className="h-6 w-6" />
                      <span>Preview Templates</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Plus className="h-6 w-6" />
                      <span>Add Channel</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Summary</CardTitle>
                <CardDescription>Overview of notification preferences by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notificationPreferences.map((pref) => (
                    <div key={pref.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          {getCategoryIcon(pref.category)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{pref.name}</h4>
                          <Badge className={getPriorityColor(pref.priority)}>
                            {pref.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pref.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Email</span>
                                                        <Switch checked={pref.email} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>SMS</span>
                                                        <Switch checked={pref.sms} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Push</span>
                                                        <Switch checked={pref.push} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure and manage all notification delivery channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {notificationChannels.map((channel) => (
                    <div key={channel.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            {channel.icon}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {channel.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">{channel.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge className={getChannelStatusColor(channel.isEnabled, channel.isVerified)}>
                                {!channel.isEnabled ? 'Disabled' : !channel.isVerified ? 'Unverified' : 'Active'}
                              </Badge>
                              {channel.lastUsed && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Last used: {formatDate(channel.lastUsed)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={channel.isEnabled}
                            onCheckedChange={() => {}}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4 mr-2" />
                            Test
                          </Button>
                        </div>
                      </div>

                      {/* Channel Configuration */}
                      {channel.isEnabled && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Channel Type
                              </Label>
                              <p className="text-sm text-gray-900 dark:text-white mt-1 capitalize">
                                {channel.type}
                              </p>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Verification Status
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                {channel.isVerified ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                )}
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {channel.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {!channel.isVerified && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                  Verification Required
                                </span>
                              </div>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                This channel needs to be verified before it can be used for notifications.
                              </p>
                              <Button size="sm" className="mt-2">
                                Verify Now
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Customize notification settings for different categories</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search preferences..."
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
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="reminders">Reminders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {notificationPreferences.map((pref) => (
                    <div key={pref.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            {getCategoryIcon(pref.category)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {pref.name}
                              </h3>
                              <Badge className={getPriorityColor(pref.priority)}>
                                {pref.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{pref.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={pref.isEnabled}
                          onCheckedChange={() => {}}
                        />
                      </div>

                      {/* Channel Preferences */}
                      {pref.isEnabled && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Delivery Channels</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                              </div>
                              <Switch
                                checked={pref.email}
                                onCheckedChange={() => {}}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS</span>
                              </div>
                              <Switch
                                checked={pref.sms}
                                onCheckedChange={() => {}}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push</span>
                              </div>
                              <Switch
                                checked={pref.push}
                                onCheckedChange={() => {}}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Slack</span>
                              </div>
                              <Switch
                                checked={pref.slack}
                                onCheckedChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Templates</CardTitle>
                <CardDescription>Manage and customize notification message templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {notificationTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {template.name}
                              </h3>
                              <Badge variant="outline">{template.category}</Badge>
                              <Badge className={template.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}>
                                {template.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Last modified: {formatDate(template.lastModified)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={template.isActive}
                            onCheckedChange={() => {}}
                          />
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>

                      {/* Template Content */}
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subject Line
                          </Label>
                          <p className="text-sm text-gray-900 dark:text-white mt-1 font-medium">
                            {template.subject}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Message Body
                          </Label>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {template.body}
                            </pre>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>Template variables: {template.body.match(/\{([^}]+)\}/g)?.map(v => v.slice(1, -1)).join(', ') || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
