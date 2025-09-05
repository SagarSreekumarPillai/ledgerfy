'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdvancedStatsProps {
  timeRange: '7d' | '30d' | '90d' | '1y'
}

interface StatData {
  label: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: 'green' | 'blue' | 'orange' | 'purple' | 'indigo'
}

export function AdvancedStats({ timeRange }: AdvancedStatsProps) {
  const [stats, setStats] = useState<StatData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call for stats
    setTimeout(() => {
      const mockStats: StatData[] = [
        {
          label: 'Revenue Growth',
          value: '₹2.4M',
          change: 12.5,
          changeType: 'increase',
          icon: <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />,
          color: 'green'
        },
        {
          label: 'Active Projects',
          value: '24',
          change: 8.2,
          changeType: 'increase',
          icon: <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
          color: 'blue'
        },
        {
          label: 'Client Satisfaction',
          value: '94.2%',
          change: 2.1,
          changeType: 'increase',
          icon: <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />,
          color: 'green'
        },
        {
          label: 'Compliance Rate',
          value: '98.7%',
          change: 0.5,
          changeType: 'increase',
          icon: <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
          color: 'orange'
        },
        {
          label: 'Team Utilization',
          value: '87.3%',
          change: -3.2,
          changeType: 'decrease',
          icon: <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
          color: 'purple'
        },
        {
          label: 'Average Response Time',
          value: '2.4h',
          change: -15.8,
          changeType: 'decrease',
          icon: <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
          color: 'indigo'
        }
      ]
      
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Advanced Analytics
        </h3>
        <Badge variant="outline" className="text-xs">
          {timeRange === '7d' && 'Last 7 days'}
          {timeRange === '30d' && 'Last 30 days'}
          {timeRange === '90d' && 'Last 90 days'}
          {timeRange === '1y' && 'Last year'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.color === 'green' && "bg-green-100 dark:bg-green-900",
                  stat.color === 'blue' && "bg-blue-100 dark:bg-blue-900", 
                  stat.color === 'orange' && "bg-orange-100 dark:bg-orange-900",
                  stat.color === 'purple' && "bg-purple-100 dark:bg-purple-900",
                  stat.color === 'indigo' && "bg-indigo-100 dark:bg-indigo-900"
                )}>
                  {stat.icon}
                </div>
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {stat.changeType === 'increase' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {stat.changeType === 'decrease' && <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className={cn(
                  "mr-2",
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {stat.changeType === 'increase' ? '+' : ''}{stat.change}%
                </span>
                <span>vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
