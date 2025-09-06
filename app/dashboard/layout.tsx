'use client'

import { useState, useEffect } from 'react'
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
  const [isClient, setIsClient] = useState(false)
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  // Debug logging
  console.log('Dashboard Layout - loading:', loading)
  console.log('Dashboard Layout - user:', user)
  console.log('Dashboard Layout - userPermissions:', loading ? ['*'] : (user?.permissions || []))

  // Initialize sidebar state from localStorage on client side
  useEffect(() => {
    setIsClient(true)
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed')
    if (savedCollapsedState !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsedState))
    }
  }, [])

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, isClient])

  const handleLogout = async () => {
    try {
      await logout()
      // Force a hard refresh to ensure all state is cleared
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback: force redirect even if logout fails
      window.location.href = '/login'
    }
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
            userPermissions={loading ? ['*'] : (user?.permissions || [])}
            collapsed={isClient ? sidebarCollapsed : false}
            onToggleCollapse={toggleSidebarCollapse}
          />

          {/* Main content */}
          <div className={cn(
            "transition-all duration-300 ease-in-out min-h-screen",
            // Use default expanded state during SSR and initial load to prevent layout shift
            !isClient ? "lg:pl-64" : (sidebarCollapsed ? "lg:pl-16" : "lg:pl-64")
          )}>
            {/* Top navigation */}
            <div className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <div className="flex items-center gap-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
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
                    user={loading ? undefined : (user || undefined)}
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

          {/* Command Palette */}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            userPermissions={loading ? ['*'] : (user?.permissions || [])}
          />
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
