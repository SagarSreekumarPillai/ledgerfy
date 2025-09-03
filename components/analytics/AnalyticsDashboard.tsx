'use client'

import { useState, useEffect } from 'react'
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
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }
  clients: {
    total: number
    active: number
    new: number
    churn: number
  }
  projects: {
    total: number
    active: number
    completed: number
    delayed: number
  }
  compliance: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  performance: {
    utilization: number
    efficiency: number
    quality: number
    satisfaction: number
  }
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    fill?: boolean
  }[]
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = () => {
    // Simulate loading analytics data
    setLoading(true)
    
    setTimeout(() => {
      setData({
        revenue: {
          current: 1250000,
          previous: 1180000,
          change: 5.93,
          trend: 'up'
        },
        clients: {
          total: 156,
          active: 142,
          new: 12,
          churn: 3
        },
        projects: {
          total: 89,
          active: 34,
          completed: 52,
          delayed: 3
        },
        compliance: {
          total: 234,
          completed: 198,
          pending: 28,
          overdue: 8
        },
        performance: {
          utilization: 87.5,
          efficiency: 92.3,
          quality: 94.8,
          satisfaction: 96.2
        }
      })
      setLoading(false)
    }, 1000)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading analytics data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Analytics Dashboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
                Refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Comprehensive business analytics and performance insights
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.revenue.current)}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {getTrendIcon(data.revenue.trend)}
              <span className={cn("text-sm font-medium", getTrendColor(data.revenue.trend))}>
                {data.revenue.change > 0 ? '+' : ''}{data.revenue.change}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs previous period
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Clients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.clients.total}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-green-600 dark:text-green-400">
                +{data.clients.new} new
              </span>
              <span className="text-red-600 dark:text-red-400">
                -{data.clients.churn} churn
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.projects.active}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-blue-600 dark:text-blue-400">
                {data.projects.completed} completed
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">
                {data.projects.delayed} delayed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPercentage((data.compliance.completed / data.compliance.total) * 100)}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-green-600 dark:text-green-400">
                {data.compliance.completed} completed
              </span>
              <span className="text-red-600 dark:text-red-400">
                {data.compliance.overdue} overdue
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Team Utilization</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPercentage(data.performance.utilization)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${data.performance.utilization}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPercentage(data.performance.efficiency)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${data.performance.efficiency}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Quality Score</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPercentage(data.performance.quality)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${data.performance.quality}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPercentage(data.performance.satisfaction)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${data.performance.satisfaction}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Quick Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Revenue Growth
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Revenue increased by {data.revenue.change}% compared to previous period
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Client Acquisition
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {data.clients.new} new clients acquired this period
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Project Delivery
                      </span>
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      {data.projects.delayed} projects are currently delayed
                    </p>
                  </div>
                  
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        Compliance Alert
                      </span>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {data.compliance.overdue} compliance items are overdue
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Revenue Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(data.revenue.current)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Period</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(data.revenue.previous)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Previous Period</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={cn("text-2xl font-bold", getTrendColor(data.revenue.trend))}>
                      {data.revenue.change > 0 ? '+' : ''}{data.revenue.change}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Revenue Trend Visualization
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Client Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.clients.total}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {data.clients.active}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      +{data.clients.new}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">New This Period</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      -{data.clients.churn}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Churned</p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Client Growth Trend
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Project Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data.projects.total}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {data.projects.active}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {data.projects.completed}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                  
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {data.projects.delayed}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delayed</p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Project Status Distribution
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>Performance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Team Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Utilization</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPercentage(data.performance.utilization)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${data.performance.utilization}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPercentage(data.performance.efficiency)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${data.performance.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Quality Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Quality Score</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPercentage(data.performance.quality)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${data.performance.quality}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPercentage(data.performance.satisfaction)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${data.performance.satisfaction}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Performance Trend Analysis
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
