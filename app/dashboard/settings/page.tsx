// FILE: ledgerfy/app/dashboard/settings/page.tsx
'use client'

import { useState } from 'react'
import { 
  Building2, 
  Users, 
  Shield, 
  Database, 
  Bell, 
  Palette,
  Settings as SettingsIcon,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const settingsSections = [
  {
    id: 'firm',
    name: 'Firm Information',
    description: 'Manage your firm details, business information, and contact details',
    icon: Building2,
    href: '/dashboard/settings/firm',
    color: 'bg-blue-500'
  },
  {
    id: 'users',
    name: 'Users & Roles',
    description: 'Manage team members, roles, and permissions',
    icon: Users,
    href: '/dashboard/settings/users',
    color: 'bg-green-500'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Configure MFA, password policies, and security settings',
    icon: Shield,
    href: '/dashboard/settings/security',
    color: 'bg-red-500'
  },
  {
    id: 'performance',
    name: 'Performance & Optimization',
    description: 'Monitor system performance and optimize application efficiency',
    icon: Zap,
    href: '/dashboard/settings/performance',
    color: 'bg-yellow-500'
  },
  {
    id: 'audit',
    name: 'Audit & Logs',
    description: 'Monitor system activities, user actions, and compliance events',
    icon: Activity,
    href: '/dashboard/settings/audit',
    color: 'bg-indigo-500'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Connect with Tally, email services, and other tools',
    icon: Database,
    href: '/dashboard/settings/integrations',
    color: 'bg-purple-500'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure email, SMS, and in-app notifications',
    icon: Bell,
    href: '/dashboard/settings/notifications',
    color: 'bg-orange-500'
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Customize themes, layouts, and display preferences',
    icon: Palette,
    href: '/dashboard/settings/appearance',
    color: 'bg-pink-500'
  }
]

const recentActivity = [
  {
    id: 1,
    action: 'Performance optimization completed',
    description: 'Database query optimization improved response time by 15%',
    time: '1 hour ago',
    type: 'performance'
  },
  {
    id: 2,
    action: 'User role updated',
    description: 'John Doe role changed from Associate to Senior',
    time: '2 hours ago',
    type: 'user'
  },
  {
    id: 3,
    action: 'Security policy updated',
    description: 'MFA requirement enabled for all users',
    time: '1 day ago',
    type: 'security'
  },
  {
    id: 4,
    action: 'New user invited',
    description: 'Jane Smith invited to join the firm',
    time: '2 days ago',
    type: 'user'
  },
  {
    id: 5,
    action: 'Integration configured',
    description: 'Tally integration settings updated',
    time: '3 days ago',
    type: 'integration'
  },
  {
    id: 6,
    action: 'Audit log exported',
    description: 'System audit logs exported to CSV for compliance review',
    time: '4 days ago',
    type: 'audit'
  }
]

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Zap className="h-4 w-4 text-yellow-500" />
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'integration':
        return <Database className="h-4 w-4 text-purple-500" />
      case 'audit':
        return <Activity className="h-4 w-4 text-indigo-500" />
      default:
        return <SettingsIcon className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your firm's configuration, users, and preferences"
      />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Card 
            key={section.id}
            className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={() => setSelectedSection(section.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-lg", section.color)}>
                  <section.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-800"
                asChild
              >
                <a href={section.href}>
                  Configure
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest changes made to your firm's settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              +2 this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Customizable
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Tally, Email, SMS
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">85</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Excellent
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
