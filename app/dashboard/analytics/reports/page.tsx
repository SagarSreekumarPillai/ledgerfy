'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Settings,
  RefreshCw,
  Plus,
  Download as DownloadIcon,
  Share2,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Activity,
  Zap
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface AnalyticsReport {
  id: string
  name: string
  type: 'financial' | 'compliance' | 'operational' | 'performance' | 'custom'
  category: string
  description: string
  lastGenerated: Date
  nextScheduled?: Date
  status: 'active' | 'draft' | 'archived'
  createdBy: string
  isFavorite: boolean
  viewCount: number
  downloadCount: number
}

interface FinancialMetrics {
  revenue: {
    current: number
    previous: number
    growth: number
    trend: 'up' | 'down' | 'stable'
  }
  profit: {
    current: number
    previous: number
    growth: number
    trend: 'up' | 'down' | 'stable'
  }
}

interface ComplianceMetrics {
  overallScore: number
  taxCompliance: number
  auditCompliance: number
  pendingItems: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export default function AnalyticsReportsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  // Mock data
  const analyticsReports: AnalyticsReport[] = [
    {
      id: '1',
      name: 'Monthly Financial Performance',
      type: 'financial',
      category: 'Revenue Analysis',
      description: 'Comprehensive analysis of monthly revenue, expenses, and profitability trends',
      lastGenerated: new Date('2024-01-20'),
      nextScheduled: new Date('2024-02-20'),
      status: 'active',
      createdBy: 'CA Team',
      isFavorite: true,
      viewCount: 45,
      downloadCount: 23
    },
    {
      id: '2',
      name: 'Compliance Dashboard',
      type: 'compliance',
      category: 'Regulatory Compliance',
      description: 'Real-time compliance status across all regulatory requirements and deadlines',
      lastGenerated: new Date('2024-01-19'),
      status: 'active',
      createdBy: 'Compliance Team',
      isFavorite: false,
      viewCount: 32,
      downloadCount: 18
    }
  ]

  const financialMetrics: FinancialMetrics = {
    revenue: {
      current: 2500000,
      previous: 2200000,
      growth: 13.64,
      trend: 'up'
    },
    profit: {
      current: 700000,
      previous: 550000,
      growth: 27.27,
      trend: 'up'
    }
  }

  const complianceMetrics: ComplianceMetrics = {
    overallScore: 87,
    taxCompliance: 92,
    auditCompliance: 85,
    pendingItems: 12,
    riskLevel: 'medium'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Analytics Reports"
        description="Generate and view comprehensive business intelligence reports"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(financialMetrics.revenue.current)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(financialMetrics.revenue.trend)}
                    <span className="text-sm text-green-600">
                      +{financialMetrics.revenue.growth}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(financialMetrics.profit.current)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(financialMetrics.profit.trend)}
                    <span className="text-sm text-green-600">
                      +{financialMetrics.profit.growth}%
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Compliance Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {complianceMetrics.overallScore}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      {complianceMetrics.pendingItems} pending
                    </span>
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsReports.length}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600">Active</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                  <CardDescription>Monthly revenue and profit trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Revenue Growth</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">vs. previous month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">+{financialMetrics.revenue.growth}%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(financialMetrics.revenue.current)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Profit Margin</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Current month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {((financialMetrics.profit.current / financialMetrics.revenue.current) * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(financialMetrics.profit.current)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Overview</CardTitle>
                  <CardDescription>Regulatory compliance status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{complianceMetrics.overallScore}%</span>
                      </div>
                      <Progress value={complianceMetrics.overallScore} className="h-3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-medium text-green-600">Tax Compliance</p>
                        <p className="text-xl font-bold text-green-700">{complianceMetrics.taxCompliance}%</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-600">Audit Compliance</p>
                        <p className="text-xl font-bold text-blue-700">{complianceMetrics.auditCompliance}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">Risk Level</span>
                      </div>
                      <Badge className={getRiskLevelColor(complianceMetrics.riskLevel)}>
                        {complianceMetrics.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Generate common reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>Financial Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <CheckCircle className="h-6 w-6" />
                    <span>Compliance Status</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>Client Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Performance Metrics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                  <CardDescription>Detailed revenue breakdown and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Current Month</p>
                        <p className="text-2xl font-bold text-green-700">
                          {formatCurrency(financialMetrics.revenue.current)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Previous Month</p>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {formatCurrency(financialMetrics.revenue.previous)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-600">Growth Rate</p>
                        <p className="text-xl font-bold text-blue-700">+{financialMetrics.revenue.growth}%</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm font-medium text-purple-600">Trend</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {getTrendIcon(financialMetrics.revenue.trend)}
                          <span className="text-sm font-medium text-purple-700">
                            {financialMetrics.revenue.trend === 'up' ? 'Growing' : 'Declining'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profit Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Profit Analysis</CardTitle>
                  <CardDescription>Profitability trends and margins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Net Profit</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {formatCurrency(financialMetrics.profit.current)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Previous Month</p>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {formatCurrency(financialMetrics.profit.previous)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-medium text-green-600">Growth</p>
                        <p className="text-xl font-bold text-green-700">+{financialMetrics.profit.growth}%</p>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <p className="text-sm font-medium text-indigo-600">Profit Margin</p>
                        <p className="text-xl font-bold text-indigo-700">
                          {((financialMetrics.profit.current / financialMetrics.revenue.current) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Analytics Reports</CardTitle>
                    <CardDescription>Manage and generate business intelligence reports</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{report.type}</Badge>
                            <Badge variant="outline">{report.category}</Badge>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Generated</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {report.lastGenerated.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Views</p>
                          <p className="text-sm text-gray-900 dark:text-white">{formatNumber(report.viewCount)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download
                          </Button>
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
