'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  Filter,
  Settings,
  Trash2,
  Archive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info' | 'reminder'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'compliance' | 'project' | 'client' | 'system' | 'user'
  isRead: boolean
  isArchived: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
  metadata?: Record<string, any>
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'compliance'>('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, filter])

  const loadNotifications = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'GST Return Due Soon',
          message: 'GST return for ABC Corporation is due in 3 days',
          type: 'reminder',
          priority: 'high',
          category: 'compliance',
          isRead: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
          actionUrl: '/dashboard/compliance',
          metadata: { clientId: 'abc123', dueDate: '2024-01-25' }
        },
        {
          id: '2',
          title: 'Project Milestone Completed',
          message: 'Tax Planning project milestone "Review Calculations" has been completed',
          type: 'success',
          priority: 'medium',
          category: 'project',
          isRead: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          actionUrl: '/dashboard/projects',
          metadata: { projectId: 'tax123', milestone: 'Review Calculations' }
        },
        {
          id: '3',
          title: 'New Client Registration',
          message: 'XYZ Limited has been registered as a new client',
          type: 'info',
          priority: 'low',
          category: 'client',
          isRead: true,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          actionUrl: '/dashboard/clients',
          metadata: { clientId: 'xyz456', clientName: 'XYZ Limited' }
        },
        {
          id: '4',
          title: 'System Maintenance',
          message: 'Scheduled system maintenance will occur tonight at 2:00 AM',
          type: 'warning',
          priority: 'medium',
          category: 'system',
          isRead: true,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          metadata: { maintenanceTime: '02:00 AM', duration: '2 hours' }
        },
        {
          id: '5',
          title: 'Critical Compliance Alert',
          message: 'TDS return for DEF Industries is overdue by 2 days',
          type: 'error',
          priority: 'critical',
          category: 'compliance',
          isRead: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          actionUrl: '/dashboard/compliance',
          metadata: { clientId: 'def789', overdueDays: 2 }
        }
      ]
      
      setNotifications(mockNotifications)
      setLoading(false)
    }, 500)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isArchived: true } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getFilteredNotifications = () => {
    let filtered = notifications.filter(notif => !notif.isArchived)
    
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(notif => !notif.isRead)
        break
      case 'critical':
        filtered = filtered.filter(notif => notif.priority === 'critical')
        break
      case 'compliance':
        filtered = filtered.filter(notif => notif.category === 'compliance')
        break
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />
      case 'reminder':
        return <Clock className="h-4 w-4 text-purple-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority] || colors.medium
  }

  const getCategoryColor = (category: Notification['category']) => {
    const colors = {
      compliance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      project: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      client: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      system: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      user: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    }
    return colors[category] || colors.system
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

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length
  const filteredNotifications = getFilteredNotifications()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with important alerts and reminders
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread
                </Button>
                <Button
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('critical')}
                >
                  Critical
                </Button>
                <Button
                  variant={filter === 'compliance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('compliance')}
                >
                  Compliance
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border rounded-lg transition-colors",
                      notification.isRead 
                        ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" 
                        : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className={cn(
                              "text-sm font-medium",
                              notification.isRead 
                                ? "text-gray-600 dark:text-gray-400" 
                                : "text-gray-900 dark:text-white"
                            )}>
                              {notification.title}
                            </h4>
                            <Badge className={cn("text-xs", getPriorityColor(notification.priority))}>
                              {notification.priority}
                            </Badge>
                            <Badge className={cn("text-xs", getCategoryColor(notification.category))}>
                              {notification.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => archiveNotification(notification.id)}
                            >
                              <Archive className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className={cn(
                          "text-sm",
                          notification.isRead 
                            ? "text-gray-500 dark:text-gray-400" 
                            : "text-gray-700 dark:text-gray-300"
                        )}>
                          {notification.message}
                        </p>
                        
                        {notification.actionUrl && (
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Navigate to action URL using Next.js router
                                router.push(notification.actionUrl!)
                                onClose()
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
