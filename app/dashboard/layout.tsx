'use client'

import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from '@/lib/theme-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNavUserMenu } from '@/components/layout/TopNavUserMenu'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  const handleMfaToggle = () => {
    // Navigate to MFA settings using Next.js router
    router.push('/dashboard/settings/security')
  }

  const handleProfileEdit = () => {
    // Navigate to profile settings using Next.js router
    router.push('/dashboard/settings/profile')
  }

  const handleSettings = () => {
    // Navigate to settings using Next.js router
    router.push('/dashboard/settings')
  }

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const openCommandPalette = () => {
    setCommandPaletteOpen(true)
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
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />

          {/* Main content */}
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          )}>
            {/* Top navigation */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <div className="flex items-center gap-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                
                {!sidebarCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                    onClick={toggleSidebarCollapse}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1" />
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* Command Palette Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCommandPalette}
                    className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden md:inline">Search</span>
                    <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      ⌘K
                    </kbd>
                  </Button>
                  
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

            {/* Breadcrumbs */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 lg:px-8">
              <Breadcrumbs />
            </div>

            {/* Page content */}
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>

          {/* Command Palette */}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            userPermissions={user?.permissions || []}
          />
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
