'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface ReportData {
  id: string
  name: string
  description: string
  type: 'financial' | 'operational' | 'compliance' | 'client' | 'project'
  category: string
  lastGenerated?: Date
  nextScheduled?: Date
  status: 'available' | 'generating' | 'scheduled' | 'error'
  format: 'pdf' | 'excel' | 'csv'
  size?: string
  downloadUrl?: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export default function ReportsPage() {
  const { hasPermission } = useAuth()
  const [reports, setReports] = useState<ReportData[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: 'Revenue Analysis Report',
          description: 'Comprehensive analysis of firm revenue, client billing, and financial performance',
          type: 'financial',
          category: 'Revenue',
          lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
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
          lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
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
          lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
          status: 'available',
          format: 'pdf',
          size: '3.1 MB',
          downloadUrl: '/reports/client-performance.pdf'
        },
        {
          id: '4',
          name: 'Project Progress Report',
          description: 'Project status, timeline adherence, and resource utilization',
          type: 'project',
          category: 'Project Management',
          lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
          status: 'available',
          format: 'excel',
          size: '2.7 MB',
          downloadUrl: '/reports/project-progress.xlsx'
        },
        {
          id: '5',
          name: 'Team Productivity Report',
          description: 'Team performance metrics, workload distribution, and efficiency analysis',
          type: 'operational',
          category: 'Team Management',
          lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
          status: 'available',
          format: 'csv',
          size: '1.2 MB',
          downloadUrl: '/reports/team-productivity.csv'
        },
        {
          id: '6',
          name: 'Tax Filing Summary',
          description: 'Summary of all tax filings, deadlines met, and pending submissions',
          type: 'compliance',
          category: 'Tax',
          lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          nextScheduled: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
          status: 'available',
          format: 'pdf',
          size: '4.2 MB',
          downloadUrl: '/reports/tax-filing-summary.pdf'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesType = !selectedType || report.type === selectedType
    const matchesCategory = !selectedCategory || report.category === selectedCategory
    return matchesType && matchesCategory
  })

  const getTypeColor = (type: string) => {
    const colors = {
      financial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      operational: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      compliance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      client: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      project: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    }
    return colors[type as keyof typeof colors] || colors.operational
  }

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      generating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.available
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-600" />
      case 'excel':
        return <FileText className="h-4 w-4 text-green-600" />
      case 'csv':
        return <FileText className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const generateReport = async (reportId: string) => {
    setGeneratingReport(reportId)
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(null)
      // Update report status
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'available', lastGenerated: new Date() }
            : report
        )
      )
    }, 3000)
  }

  const downloadReport = (report: ReportData) => {
    if (report.downloadUrl) {
      // Simulate download
      const link = document.createElement('a')
      link.href = report.downloadUrl
      link.download = `${report.name}.${report.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeUntilNext = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `${diffDays} days`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reports & Analytics"
          description="Generate and view business reports and analytics"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
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
        title="Reports & Analytics"
        description="Generate and view business reports and analytics"
      >
        <PageHeaderActions>
          <RequirePermission permission="reports:create">
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </RequirePermission>
        </PageHeaderActions>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">127</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="compliance">Compliance</option>
                <option value="client">Client</option>
                <option value="project">Project</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Revenue">Revenue</option>
                <option value="Compliance">Compliance</option>
                <option value="Client Relations">Client Relations</option>
                <option value="Project Management">Project Management</option>
                <option value="Team Management">Team Management</option>
                <option value="Tax">Tax</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedType('')
                  setSelectedCategory('')
                  setTimeRange('30d')
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Generate and download business reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getFormatIcon(report.format)}
                    <Badge className={cn("text-xs", getTypeColor(report.type))}>
                      {report.type}
                    </Badge>
                    <Badge className={cn("text-xs", getStatusColor(report.status))}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Category: {report.category}</span>
                      {report.lastGenerated && (
                        <span>Last: {formatDate(report.lastGenerated)}</span>
                      )}
                      {report.nextScheduled && (
                        <span>Next: {getTimeUntilNext(report.nextScheduled)}</span>
                      )}
                      {report.size && <span>Size: {report.size}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {report.status === 'available' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReport(report)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={generatingReport === report.id}
                      onClick={() => generateReport(report.id)}
                    >
                      {generatingReport === report.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filters or create a new report.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
