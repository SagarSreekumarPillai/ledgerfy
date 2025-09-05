'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Share2,
  Filter,
  Search
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface KPI {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  status: 'on-track' | 'at-risk' | 'behind'
  category: 'financial' | 'operational' | 'client' | 'compliance'
}

interface Insight {
  id: string
  title: string
  description: string
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly'
  priority: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  category: string
  timestamp: Date
  actionable: boolean
}

interface Forecast {
  metric: string
  current: number
  forecast: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  factors: string[]
}

export function BusinessIntelligence() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [searchQuery, setSearchQuery] = useState('')
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinessIntelligenceData()
  }, [selectedCategory, selectedTimeframe])

  const loadBusinessIntelligenceData = () => {
    setLoading(true)
    
    // Simulate loading data
    setTimeout(() => {
      setKpis([
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
      ])

      setInsights([
        {
          id: 'insight_1',
          title: 'Revenue growth below target',
          description: 'Current revenue growth rate of 5.93% is below the target of 8.0%. Consider reviewing pricing strategies and client acquisition efforts.',
          type: 'risk',
          priority: 'high',
          impact: 'high',
          category: 'financial',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
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
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
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
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
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
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          actionable: true
        }
      ])

      setForecasts([
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
      ])

      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'behind':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'trend':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'anomaly':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 dark:text-red-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'low':
        return 'text-green-600 dark:text-green-400 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 dark:text-green-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 dark:text-red-400" />
      default:
        return <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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

  const filteredKpis = kpis.filter(kpi => 
    selectedCategory === 'all' || kpi.category === selectedCategory
  )

  const filteredInsights = insights.filter(insight => 
    (selectedCategory === 'all' || insight.category === selectedCategory) &&
    (searchQuery === '' || 
     insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     insight.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading business intelligence data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Business Intelligence</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Advanced analytics, KPI tracking, and business insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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
          </div>
        </CardContent>
      </Card>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>
            Track critical business metrics against targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredKpis.map((kpi) => (
              <div
                key={kpi.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {kpi.name}
                  </h4>
                  <Badge className={getStatusColor(kpi.status)}>
                    {kpi.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}{kpi.unit}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(kpi.trend)}
                      <span className={cn(
                        "text-sm font-medium",
                        kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                        kpi.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600'
                      )}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}{kpi.unit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Target</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {kpi.target}{kpi.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        kpi.value >= kpi.target ? "bg-green-600" :
                        kpi.value >= kpi.target * 0.8 ? "bg-yellow-600" : "bg-red-600"
                      )}
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
          <CardDescription>
            AI-powered insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {insight.type === 'opportunity' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    {insight.type === 'risk' && <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                    {insight.type === 'trend' && <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                    {insight.type === 'anomaly' && <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {insight.title}
                      </h4>
                      <Badge className={getInsightTypeColor(insight.type)}>
                        {insight.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Priority: <span className={cn("font-medium", getPriorityColor(insight.priority))}>
                          {insight.priority}
                        </span></span>
                        <span>Impact: <span className={cn("font-medium", getPriorityColor(insight.impact))}>
                          {insight.impact}
                        </span></span>
                        <span>{formatTimeAgo(insight.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {insight.actionable && (
                          <Button variant="outline" size="sm">
                            Take Action
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecasts and Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Forecasts & Predictions</CardTitle>
          <CardDescription>
            AI-powered business forecasting and trend analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {forecasts.map((forecast, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {forecast.metric} Forecast
                  </h4>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(forecast.trend)}
                    <Badge variant="outline" className="text-xs">
                      {forecast.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {forecast.metric === 'Revenue' ? formatCurrency(forecast.current) : forecast.current}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Forecast</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 dark:text-blue-400">
                        {forecast.metric === 'Revenue' ? formatCurrency(forecast.forecast) : forecast.forecast}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Factors</div>
                    <div className="space-y-1">
                      {forecast.factors.map((factor, factorIndex) => (
                        <div key={factorIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
