'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Target,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  FileText,
  Shield
} from 'lucide-react'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { BusinessIntelligence } from '@/components/analytics/BusinessIntelligence'
import { RequirePermission } from '@/components/auth/RequirePermission'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Business Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive business analytics, KPI tracking, and AI-powered insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Data Updated
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Revenue Growth
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  +5.93%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Target: 8.0%</span>
                <span className="text-yellow-600 dark:text-yellow-400">At Risk</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Client Retention
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  94.2%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Target: 95.0%</span>
                <span className="text-green-600 dark:text-green-400">On Track</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '99%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Project Delivery
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  12.5 days
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Target: 10.0 days</span>
                <span className="text-red-600 dark:text-red-400">Behind</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Compliance Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  98.7%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Target: 99.0%</span>
                <span className="text-green-600 dark:text-green-400">On Track</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.7%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Key Insights</span>
          </CardTitle>
          <CardDescription>
            AI-powered business insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  High Priority Alert
                </span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                Revenue growth below target. Review pricing strategies and client acquisition efforts.
              </p>
            </div>
            
            <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Performance Issue
                </span>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Project delivery delays detected. Review project management processes.
              </p>
            </div>
            
            <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Positive Trend
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Client retention improving. Continue focusing on client satisfaction.
              </p>
            </div>
            
            <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Opportunity
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Team utilization below target. Consider workload balancing and skill development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Analytics Tools</span>
          </CardTitle>
          <CardDescription>
            Comprehensive analytics dashboard and business intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Analytics Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="intelligence" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Business Intelligence</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <RequirePermission permission="analytics:read">
                <AnalyticsDashboard />
              </RequirePermission>
            </TabsContent>
            
            <TabsContent value="intelligence" className="mt-6">
              <RequirePermission permission="analytics:read">
                <BusinessIntelligence />
              </RequirePermission>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analytics Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common analytics tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-center space-y-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">Generate Report</span>
              <span className="text-xs text-gray-500">Create custom analytics report</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-center space-y-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Set KPI Targets</span>
              <span className="text-xs text-gray-500">Configure performance targets</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-center space-y-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-medium">AI Insights</span>
              <span className="text-xs text-gray-500">Generate AI-powered insights</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col items-center space-y-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Export Data</span>
              <span className="text-xs text-gray-500">Export analytics data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
