'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  AlertTriangle,
  Bell,
  BarChart3,
  Calendar,
  DollarSign,
  CheckCircle,
  X
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdvancedStats } from '@/components/dashboard/AdvancedStats'

import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface DashboardStats {
  totalClients: number
  activeProjects: number
  pendingCompliance: number
  overdueItems: number
  revenueThisMonth: number
  revenueLastMonth: number
  teamUtilization: number
  clientSatisfaction: number
}

interface RecentActivity {
  id: string
  type: 'compliance' | 'project' | 'client' | 'document' | 'user'
  title: string
  description: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  actionUrl?: string
}

interface UpcomingDeadline {
  id: string
  title: string
  type: 'compliance' | 'project' | 'client'
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  daysUntilDue: number
  actionUrl?: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalClients: 24,
        activeProjects: 18,
        pendingCompliance: 12,
        overdueItems: 3,
        revenueThisMonth: 850000,
        revenueLastMonth: 720000,
        teamUtilization: 87,
        clientSatisfaction: 94
      })

      setRecentActivities([
        {
          id: '1',
          type: 'compliance',
          title: 'GST Return Filed',
          description: 'GST return for ABC Corporation has been successfully filed',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          priority: 'high',
          actionUrl: '/dashboard/compliance'
        },
        {
          id: '2',
          type: 'project',
          title: 'Project Milestone Completed',
          description: 'Tax Planning project milestone "Review Calculations" completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          priority: 'medium',
          actionUrl: '/dashboard/projects'
        },
        {
          id: '3',
          type: 'client',
          title: 'New Client Onboarded',
          description: 'XYZ Limited has been successfully onboarded',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          priority: 'low',
          actionUrl: '/dashboard/clients'
        },
        {
          id: '4',
          type: 'document',
          title: 'Document Uploaded',
          description: 'Annual audit report for DEF Industries uploaded',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          priority: 'medium',
          actionUrl: '/dashboard/documents'
        }
      ])

      setUpcomingDeadlines([
        {
          id: '1',
          title: 'TDS Return Q4 FY 2024-25',
          type: 'compliance',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
          priority: 'high',
          daysUntilDue: 2,
          actionUrl: '/dashboard/compliance'
        },
        {
          id: '2',
          title: 'Annual Audit Report',
          type: 'project',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
          priority: 'medium',
          daysUntilDue: 7,
          actionUrl: '/dashboard/projects'
        },
        {
          id: '3',
          title: 'Client Review Meeting',
          type: 'client',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
          priority: 'low',
          daysUntilDue: 3,
          actionUrl: '/dashboard/clients'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance':
        return <FileText className="h-4 w-4 text-orange-600" />
      case 'project':
        return <BarChart3 className="h-4 w-4 text-blue-600" />
      case 'client':
        return <Users className="h-4 w-4 text-green-600" />
      case 'document':
        return <FileText className="h-4 w-4 text-purple-600" />
      case 'user':
        return <Users className="h-4 w-4 text-indigo-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
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

  const getDaysUntilDueColor = (days: number) => {
    if (days <= 1) return 'text-red-600 dark:text-red-400'
    if (days <= 3) return 'text-orange-600 dark:text-orange-400'
    if (days <= 7) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's what's happening with your firm."
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
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
        title="Dashboard"
        description="Welcome back! Here's what's happening with your firm."
      >
        <PageHeaderActions>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            

          </div>
        </PageHeaderActions>
      </PageHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/dashboard/clients')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/dashboard/projects')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/dashboard/compliance')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Compliance</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.pendingCompliance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/dashboard/compliance')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Items</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.overdueItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <AdvancedStats timeRange={timeRange} />

      {/* Financial Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(stats?.revenueThisMonth || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(stats?.revenueLastMonth || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Growth</span>
                <span className={cn(
                  "font-medium",
                  (stats?.revenueThisMonth || 0) > (stats?.revenueLastMonth || 0) 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                )}>
                  {stats && stats.revenueLastMonth > 0 
                    ? `${(((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100).toFixed(1)}%`
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Team Utilization</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats?.teamUtilization}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats?.clientSatisfaction}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats?.teamUtilization || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Upcoming Deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors" onClick={() => activity.actionUrl && router.push(activity.actionUrl)}>
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <Badge className={cn("text-xs", getPriorityColor(activity.priority))}>
                        {activity.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {activity.description}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Important dates and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors" onClick={() => deadline.actionUrl && router.push(deadline.actionUrl)}>
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {deadline.title}
                      </h4>
                      <Badge className={cn("text-xs", getPriorityColor(deadline.priority))}>
                        {deadline.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {deadline.type}
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        getDaysUntilDueColor(deadline.daysUntilDue)
                      )}>
                        {deadline.daysUntilDue === 0 ? 'Due today' : 
                         deadline.daysUntilDue === 1 ? 'Due tomorrow' : 
                         `${deadline.daysUntilDue} days left`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
