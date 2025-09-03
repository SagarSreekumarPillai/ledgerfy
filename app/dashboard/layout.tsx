'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { ThemeProvider } from '@/lib/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNavUserMenu } from '@/components/layout/TopNavUserMenu'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const handleMfaToggle = () => {
    // Navigate to MFA settings
    window.location.href = '/dashboard/settings/security'
  }

  const handleProfileEdit = () => {
    // Navigate to profile settings
    window.location.href = '/dashboard/settings/profile'
  }

  const handleSettings = () => {
    // Navigate to settings
    window.location.href = '/dashboard/settings'
  }

  return (
    <ProtectedRoute>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            userPermissions={user?.permissions || []}
          />

          {/* Main content */}
          <div className="lg:pl-64">
            {/* Top navigation */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1" />
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <ThemeToggle />
                  <TopNavUserMenu
                    user={user || undefined}
                    onLogout={handleLogout}
                    onMfaToggle={handleMfaToggle}
                    onProfileEdit={handleProfileEdit}
                    onSettings={handleSettings}
                  />
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
