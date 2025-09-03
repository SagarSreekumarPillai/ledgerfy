'use client'

import { useState } from 'react'
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Square,
  BarChart3,
  Database,
  TrendingUp,
  Users,
  FileSpreadsheet,
  FileCode,
  Archive,
  Zap
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

interface ExportJob {
  id: string
  name: string
  description: string
  dataType: 'financial' | 'compliance' | 'client' | 'operational' | 'custom'
  format: 'excel' | 'csv' | 'pdf' | 'json' | 'xml'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  progress: number
  createdAt: Date
  scheduledFor?: Date
  completedAt?: Date
  fileSize?: number
  downloadUrl?: string
  isRecurring: boolean
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  lastRun?: Date
  nextRun?: Date
  createdBy: string
}

interface ExportTemplate {
  id: string
  name: string
  description: string
  dataType: string
  format: string
  filters: string[]
  isActive: boolean
  lastUsed: Date
  useCount: number
}

export default function AnalyticsExportPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDataType, setSelectedDataType] = useState('all')

  // Mock data
  const exportJobs: ExportJob[] = [
    {
      id: '1',
      name: 'Monthly Financial Report',
      description: 'Complete financial data export for January 2024',
      dataType: 'financial',
      format: 'excel',
      status: 'completed',
      progress: 100,
      createdAt: new Date('2024-01-20T10:00:00'),
      completedAt: new Date('2024-01-20T10:15:00'),
      fileSize: 2048,
      downloadUrl: '/exports/monthly-financial-jan-2024.xlsx',
      isRecurring: true,
      recurrence: 'monthly',
      lastRun: new Date('2024-01-20T10:15:00'),
      nextRun: new Date('2024-02-20T10:00:00'),
      createdBy: 'CA Team'
    },
    {
      id: '2',
      name: 'Client Portfolio Analysis',
      description: 'Client performance and profitability analysis',
      dataType: 'client',
      format: 'pdf',
      status: 'processing',
      progress: 65,
      createdAt: new Date('2024-01-20T11:00:00'),
      isRecurring: false,
      createdBy: 'Business Development'
    }
  ]

  const exportTemplates: ExportTemplate[] = [
    {
      id: '1',
      name: 'Standard Financial Export',
      description: 'Basic financial data export template',
      dataType: 'financial',
      format: 'excel',
      filters: ['date_range', 'account_type', 'amount_range'],
      isActive: true,
      lastUsed: new Date('2024-01-20T10:00:00'),
      useCount: 45
    },
    {
      id: '2',
      name: 'Compliance Summary',
      description: 'Compliance status summary template',
      dataType: 'compliance',
      format: 'pdf',
      filters: ['compliance_type', 'status', 'due_date'],
      isActive: true,
      lastUsed: new Date('2024-01-19T14:30:00'),
      useCount: 23
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'financial':
        return <TrendingUp className="h-5 w-5" />
      case 'compliance':
        return <FileText className="h-5 w-5" />
      case 'client':
        return <Users className="h-5 w-5" />
      case 'operational':
        return <BarChart3 className="h-5 w-5" />
      case 'custom':
        return <Settings className="h-5 w-5" />
      default:
        return <Database className="h-5 w-5" />
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5" />
      case 'csv':
        return <FileText className="h-5 w-5" />
      case 'pdf':
        return <FileText className="h-5 w-5" />
      case 'json':
        return <FileCode className="h-5 w-5" />
      case 'xml':
        return <FileCode className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-600" />
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getActiveJobCount = () => {
    return exportJobs.filter(job => job.status === 'processing' || job.status === 'pending').length
  }

  const getCompletedJobCount = () => {
    return exportJobs.filter(job => job.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Data Export"
        description="Export data in various formats, schedule recurring exports, and manage export templates"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Export Job
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Export Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getActiveJobCount()}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{getCompletedJobCount()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Jobs</p>
                  <p className="text-2xl font-bold text-purple-600">{exportJobs.length}</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Templates</p>
                  <p className="text-2xl font-bold text-orange-600">{exportTemplates.length}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Export Jobs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Export Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Export Jobs</CardTitle>
                  <CardDescription>Latest export job status and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exportJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            {getDataTypeIcon(job.dataType)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{job.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {job.format.toUpperCase()} • {job.dataType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(job.status)}
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
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
                  <CardDescription>Common export tasks and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <FileSpreadsheet className="h-6 w-6" />
                      <span>Export to Excel</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <FileText className="h-6 w-6" />
                      <span>Export to PDF</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Calendar className="h-6 w-6" />
                      <span>Schedule Export</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      <span>Export Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Export Jobs</CardTitle>
                    <CardDescription>Monitor and manage all export jobs</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {exportJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            {getDataTypeIcon(job.dataType)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {job.name}
                              </h3>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                              <Badge variant="outline">{job.format.toUpperCase()}</Badge>
                              {job.isRecurring && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                  {job.recurrence}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{job.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>Created by: {job.createdBy}</span>
                              <span>Created: {formatDate(job.createdAt)}</span>
                              {job.scheduledFor && (
                                <span>Scheduled: {formatDate(job.scheduledFor)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.status === 'processing' && (
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </Button>
                          )}
                          {job.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          )}
                          {job.status === 'completed' && job.downloadUrl && (
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>

                      {/* Job Progress and Details */}
                      <div className="mt-4 pt-4 border-t space-y-4">
                        {/* Progress Bar */}
                        {job.status === 'processing' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Progress
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {job.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Job Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Data Type
                            </Label>
                            <p className="text-sm text-gray-900 dark:text-white mt-1 capitalize">
                              {job.dataType}
                            </p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Export Format
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              {getFormatIcon(job.format)}
                              <span className="text-sm text-gray-900 dark:text-white capitalize">
                                {job.format}
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              File Size
                            </Label>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">
                              {job.fileSize ? formatFileSize(job.fileSize) : 'Not available'}
                            </p>
                          </div>
                        </div>
                      </div>
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
                <CardTitle>Export Templates</CardTitle>
                <CardDescription>Manage and customize export templates for common data exports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {exportTemplates.map((template) => (
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
                              <Badge variant="outline">{template.dataType}</Badge>
                              <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                              <Badge className={template.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}>
                                {template.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>Used {template.useCount} times</span>
                              <span>Last used: {formatDate(template.lastUsed)}</span>
                            </div>
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
                            <Play className="h-4 w-4 mr-2" />
                            Use
                          </Button>
                        </div>
                      </div>

                      {/* Template Filters */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Available Filters</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.filters.map((filter) => (
                            <Badge key={filter} variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {filter.replace('_', ' ')}
                            </Badge>
                          ))}
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
