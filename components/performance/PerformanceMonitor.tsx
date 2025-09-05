'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Clock, 
  Database, 
  Server, 
  Globe, 
  HardDrive,
  Cpu,
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PerformanceMetrics {
  system: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  database: {
    connections: number
    queries: number
    responseTime: number
    cacheHitRate: number
  }
  application: {
    responseTime: number
    throughput: number
    errorRate: number
    uptime: number
  }
  lastUpdated: Date
}

interface PerformanceAlert {
  id: string
  type: 'warning' | 'error' | 'critical'
  message: string
  metric: string
  value: number
  threshold: number
  timestamp: Date
  status: 'active' | 'resolved'
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadPerformanceData, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  useEffect(() => {
    loadPerformanceData()
  }, [])

  const loadPerformanceData = () => {
    // Simulate real-time performance data
    setMetrics({
      system: {
        cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
        memory: Math.floor(Math.random() * 40) + 30, // 30-70%
        disk: Math.floor(Math.random() * 20) + 15, // 15-35%
        network: Math.floor(Math.random() * 25) + 10 // 10-35%
      },
      database: {
        connections: Math.floor(Math.random() * 20) + 15, // 15-35
        queries: Math.floor(Math.random() * 1000) + 500, // 500-1500
        responseTime: Math.floor(Math.random() * 50) + 20, // 20-70ms
        cacheHitRate: Math.floor(Math.random() * 20) + 75 // 75-95%
      },
      application: {
        responseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
        throughput: Math.floor(Math.random() * 500) + 1000, // 1000-1500 req/s
        errorRate: Math.floor(Math.random() * 5) + 1, // 1-6%
        uptime: 99.98
      },
      lastUpdated: new Date()
    })

    // Generate performance alerts
    const newAlerts: PerformanceAlert[] = []
    
    if (Math.random() > 0.7) {
      newAlerts.push({
        id: `alert_${Date.now()}`,
        type: 'warning',
        message: 'High CPU usage detected',
        metric: 'CPU',
        value: 75,
        threshold: 70,
        timestamp: new Date(),
        status: 'active'
      })
    }
    
    if (Math.random() > 0.8) {
      newAlerts.push({
        id: `alert_${Date.now() + 1}`,
        type: 'error',
        message: 'Database response time exceeded threshold',
        metric: 'DB Response',
        value: 120,
        threshold: 100,
        timestamp: new Date(),
        status: 'active'
      })
    }

    setAlerts(prev => [...newAlerts, ...prev.slice(0, 4)]) // Keep last 5 alerts
    setLoading(false)
  }

  const getPerformanceColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600 dark:text-red-400'
    if (value >= thresholds.warning) return 'text-yellow-600 dark:text-yellow-400 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400 dark:text-green-400'
  }

  const getPerformanceBadge = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    if (value >= thresholds.warning) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }

  const getAlertTypeColor = (type: string) => {
    const colors = {
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[type as keyof typeof colors] || colors.warning
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 dark:text-yellow-400" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 dark:text-orange-400" />
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
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
                <p className="text-gray-500 dark:text-gray-400">Loading performance data...</p>
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
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Performance Overview</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadPerformanceData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time system performance metrics and monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* System Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <Server className="h-4 w-4" />
                <span>System</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "text-sm font-medium",
                      getPerformanceColor(metrics.system.cpu, { warning: 70, critical: 90 })
                    )}>
                      {metrics.system.cpu}%
                    </span>
                    <Badge className={cn(
                      "text-xs",
                      getPerformanceBadge(metrics.system.cpu, { warning: 70, critical: 90 })
                    )}>
                      {metrics.system.cpu >= 90 ? 'Critical' : 
                       metrics.system.cpu >= 70 ? 'Warning' : 'Normal'}
                    </Badge>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      metrics.system.cpu >= 90 ? "bg-red-600" :
                      metrics.system.cpu >= 70 ? "bg-yellow-600" : "bg-green-600"
                    )}
                    style={{ width: `${metrics.system.cpu}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.system.memory}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Disk I/O</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.system.disk}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.system.network}%
                  </span>
                </div>
              </div>
            </div>

            {/* Database Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Database</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Connections</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.database.connections}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Queries/sec</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.database.queries.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className={cn(
                    "text-sm font-medium",
                    getPerformanceColor(metrics.database.responseTime, { warning: 50, critical: 100 })
                  )}>
                    {metrics.database.responseTime}ms
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.database.cacheHitRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Application Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Application</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className={cn(
                    "text-sm font-medium",
                    getPerformanceColor(metrics.application.responseTime, { warning: 100, critical: 200 })
                  )}>
                    {metrics.application.responseTime}ms
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Throughput</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics.application.throughput.toLocaleString()} req/s
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                  <span className={cn(
                    "text-sm font-medium",
                    getPerformanceColor(metrics.application.errorRate, { warning: 5, critical: 10 })
                  )}>
                    {metrics.application.errorRate}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 dark:text-green-400">
                    {metrics.application.uptime}%
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Score */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Performance Score</span>
              </h4>
              
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - 85 / 100)}`}
                      className="text-green-600 dark:text-green-400"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">85</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Excellent</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {formatTimeAgo(metrics.lastUpdated)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Alerts</CardTitle>
          <CardDescription>
            Active performance warnings and critical alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No active performance alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getAlertTypeIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <Badge className={cn("text-xs", getAlertTypeColor(alert.type))}>
                        {alert.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.metric}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Value: {alert.value}</span>
                      <span>Threshold: {alert.threshold}</span>
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Actions</CardTitle>
          <CardDescription>
            Quick actions to optimize system performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">CPU Optimization</span>
              <span className="text-xs text-gray-500">Analyze and optimize CPU usage</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
                              <HardDrive className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium">Memory Cleanup</span>
              <span className="text-xs text-gray-500">Clear memory cache and optimize</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium">DB Optimization</span>
              <span className="text-xs text-gray-500">Optimize database queries</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-start space-y-2">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="font-medium">Performance Report</span>
              <span className="text-xs text-gray-500">Generate detailed report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
