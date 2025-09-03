'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Settings, 
  Zap, 
  BarChart3, 
  Gauge, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Database,
  HardDrive,
  Network,
  Shield
} from 'lucide-react'
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'
import { OptimizationTools } from '@/components/performance/OptimizationTools'
import { RequirePermission } from '@/components/auth/RequirePermission'

export default function PerformanceSettingsPage() {
  const [activeTab, setActiveTab] = useState('monitor')

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Performance & Optimization
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor system performance and optimize application efficiency
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Last Updated: 2m ago
          </Badge>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  CPU Usage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  24%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Normal</span>
                <span className="text-green-600 dark:text-green-400">-2%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Gauge className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Memory Usage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  67%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Warning</span>
                <span className="text-yellow-600 dark:text-yellow-400">+5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Response Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  45ms
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Good</span>
                <span className="text-green-600 dark:text-green-400">-12ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Throughput
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1.2k
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">req/s</span>
                <span className="text-green-600 dark:text-green-400">+8%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Performance Alerts</span>
          </CardTitle>
          <CardDescription>
            Recent performance warnings and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Memory usage approaching threshold
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Current: 67% | Threshold: 70% | Consider memory cleanup
                </p>
              </div>
              <Button variant="outline" size="sm">
                Optimize
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Database performance improved
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Query response time reduced by 15% after index optimization
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Performance Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Performance Tools</span>
          </CardTitle>
          <CardDescription>
            Monitor system metrics and optimize performance settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monitor" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Performance Monitor</span>
              </TabsTrigger>
              <TabsTrigger value="optimize" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Optimization Tools</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="monitor" className="mt-6">
              <RequirePermission permission="performance:read">
                <PerformanceMonitor />
              </RequirePermission>
            </TabsContent>
            
            <TabsContent value="optimize" className="mt-6">
              <RequirePermission permission="performance:update">
                <OptimizationTools />
              </RequirePermission>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
          <CardDescription>
            AI-powered suggestions to improve system performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Database Optimization
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Consider adding composite indexes for frequently queried fields to improve query performance.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Priority: Medium
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Impact: High
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <HardDrive className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Cache Strategy
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Implement Redis caching for frequently accessed data to reduce database load.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Priority: High
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Impact: High
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Network className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Network Optimization
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Enable gzip compression for API responses to reduce bandwidth usage.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Priority: Low
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Impact: Medium
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Shield className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    Security Scan
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Schedule regular vulnerability scans to identify potential security issues.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Priority: High
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Impact: Critical
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
