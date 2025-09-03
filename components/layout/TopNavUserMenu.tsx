'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  Bell,
  ChevronDown,
  Key,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const router = useRouter()

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

  if (!user) {
    return (
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-4 lg:gap-x-6">
      {/* Notifications */}
      <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              Mark all read
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-y-auto">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New document uploaded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    GST Return for ABC Corp uploaded by John Doe
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    2 minutes ago
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Compliance deadline approaching</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    TDS filing due in 3 days for XYZ Ltd
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Task completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Monthly reconciliation completed by Jane Smith
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    3 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button variant="outline" size="sm" className="w-full">
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

      {/* User Menu */}
      <DropdownMenu>
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
            <ChevronDown className="h-4 w-4 text-gray-400" />
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
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onMfaToggle}>
            <Smartphone className="mr-2 h-4 w-4" />
            <span>{user.mfaEnabled ? 'Disable MFA' : 'Enable MFA'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
