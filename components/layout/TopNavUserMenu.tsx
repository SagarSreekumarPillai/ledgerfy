'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  Bell,
  ChevronDown,
  Key,
  Smartphone,
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  Filter,
  Trash2,
  Archive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme-context'
import { useScrollbarLock } from '@/lib/useScrollbarLock'

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

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  firmId: string
  roleId: string
  mfaEnabled: boolean
  permissions: string[]
  isActive: boolean
  isEmailVerified: boolean
  lastLogin: string
  preferences: {
    theme?: 'light' | 'dark' | 'system'
    language?: string
    timezone?: string
  }
}

interface TopNavUserMenuProps {
  user?: User
  onLogout: () => void
  onMfaToggle?: () => void
  onProfileEdit?: () => void
  onSettings?: () => void
}

export function TopNavUserMenu({ 
  user, 
  onLogout, 
  onMfaToggle, 
  onProfileEdit, 
  onSettings 
}: TopNavUserMenuProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'compliance'>('all')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  
  // Prevent layout shift when dropdowns open
  useScrollbarLock(notificationsOpen || userMenuOpen)

  useEffect(() => {
    if (notificationsOpen) {
      loadNotifications()
    }
  }, [notificationsOpen])

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
    const iconColor = resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
    switch (type) {
      case 'success':
        return <CheckCircle className={cn("h-4 w-4", iconColor)} />
      case 'warning':
        return <AlertTriangle className={cn("h-4 w-4", iconColor)} />
      case 'error':
        return <AlertTriangle className={cn("h-4 w-4", iconColor)} />
      case 'info':
        return <Info className={cn("h-4 w-4", iconColor)} />
      case 'reminder':
        return <Clock className={cn("h-4 w-4", iconColor)} />
      default:
        return <Info className={cn("h-4 w-4", iconColor)} />
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

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getRoleColor = (roleName: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      partner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      senior: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      associate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      client: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[roleName as keyof typeof colors] || colors.associate
  }

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length
  const filteredNotifications = getFilteredNotifications()

  if (!user) {
    return (
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <Button variant="ghost" size="icon">
          <Bell className={cn("h-5 w-5", resolvedTheme === 'dark' ? "text-gray-300" : "text-gray-600")} />
        </Button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
        <Button variant="ghost" size="icon">
          <User className={cn("h-5 w-5", resolvedTheme === 'dark' ? "text-gray-300" : "text-gray-600")} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-4 lg:gap-x-6">
      {/* Enhanced Notifications */}
      <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className={cn("h-5 w-5", resolvedTheme === 'dark' ? "text-gray-300" : "text-gray-600")} />
            {/* Notification badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 max-h-[80vh] overflow-hidden">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={markAllAsRead}>
              Mark all read
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Filters */}
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-1">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs h-7 px-2"
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
                className="text-xs h-7 px-2"
              >
                Unread
              </Button>
              <Button
                variant={filter === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('critical')}
                className="text-xs h-7 px-2"
              >
                Critical
              </Button>
              <Button
                variant={filter === 'compliance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('compliance')}
                className="text-xs h-7 px-2"
              >
                Compliance
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className={cn("mx-auto h-8 w-8", resolvedTheme === 'dark' ? "text-gray-500" : "text-gray-400")} />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No notifications
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 border-b border-gray-100 dark:border-gray-700 transition-colors",
                      notification.isRead 
                        ? "bg-gray-50 dark:bg-gray-800" 
                        : "bg-white dark:bg-gray-900"
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
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className={cn("h-3 w-3", resolvedTheme === 'dark' ? "text-gray-400" : "text-gray-500")} />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className={cn(
                          "text-xs mb-2",
                          notification.isRead 
                            ? "text-gray-500 dark:text-gray-400" 
                            : "text-gray-700 dark:text-gray-300"
                        )}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={cn("text-xs", getCategoryColor(notification.category))}>
                            {notification.category}
                          </Badge>
                          
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2"
                              onClick={() => {
                                router.push(notification.actionUrl!)
                                setNotificationsOpen(false)
                              }}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => {
                    router.push('/dashboard/settings/notifications')
                    setNotificationsOpen(false)
                  }}
                >
                  View all notifications
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

      {/* User Menu */}
      <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.firstName} />
              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <ChevronDown className={cn("h-4 w-4", resolvedTheme === 'dark' ? "text-gray-400" : "text-gray-500")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {user.mfaEnabled && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    MFA
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onProfileEdit}>
            <User className={cn("mr-2 h-4 w-4", resolvedTheme === 'dark' ? "text-gray-300" : "text-gray-600")} />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onMfaToggle}>
            <Smartphone className={cn("mr-2 h-4 w-4", resolvedTheme === 'dark' ? "text-gray-300" : "text-gray-600")} />
            <span>{user.mfaEnabled ? 'Disable MFA' : 'Enable MFA'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onSettings}>
            <Settings className={cn("mr-2 h-4 w-4", resolvedTheme === 'dark' ? "text-gray-300" : "text-gray-600")} />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400">
            <LogOut className={cn("mr-2 h-4 w-4", resolvedTheme === 'dark' ? "text-red-400" : "text-red-600")} />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
