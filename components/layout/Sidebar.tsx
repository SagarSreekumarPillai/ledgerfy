'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, 
  FileText, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  FolderOpen,
  CheckSquare,
  Database,
  PieChart,
  Shield,
  X,
  ChevronRight,
  ChevronDown,
  TestTube,
  Home,
  Briefcase,
  CreditCard,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavigationItem[]
  requiredPermission?: string
}

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  userPermissions?: string[]
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  userPermissions = [], 
  collapsed = false,
  onToggleCollapse 
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard'])

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    // Check if user has wildcard permission
    if (userPermissions.includes('*')) return true
    return userPermissions.includes(permission)
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const handleNavigation = (href: string) => {
    // Close mobile sidebar on navigation
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
    // Use Next.js router for client-side navigation
    router.push(href)
  }

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      requiredPermission: 'dashboard:read'
    },
    {
      name: 'Document Management',
      href: '/dashboard/documents',
      icon: FileText,
      requiredPermission: 'documents:read',
      children: [
        { name: 'All Documents', href: '/dashboard/documents', icon: FileText },
        { name: 'Upload', href: '/dashboard/documents/upload', icon: FileText, requiredPermission: 'documents:upload' },
        { name: 'Shared', href: '/dashboard/documents/shared', icon: FileText, requiredPermission: 'documents:share' },
        { name: 'Templates', href: '/dashboard/documents/templates', icon: FileText, requiredPermission: 'documents:read' }
      ]
    },
    {
      name: 'Compliance',
      href: '/dashboard/compliance',
      icon: Calendar,
      requiredPermission: 'compliance:read',
      children: [
        { name: 'Overview', href: '/dashboard/compliance', icon: Calendar },
        { name: 'Calendar', href: '/dashboard/compliance/calendar', icon: Calendar, requiredPermission: 'compliance:read' },
        { name: 'Templates', href: '/dashboard/compliance/templates', icon: CheckSquare, requiredPermission: 'compliance:read' },
        { name: 'Reports', href: '/dashboard/compliance/reports', icon: BarChart3, requiredPermission: 'compliance:read' }
      ]
    },
    {
      name: 'Projects & Tasks',
      href: '/dashboard/projects',
      icon: Briefcase,
      requiredPermission: 'projects:read',
      children: [
        { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
        { name: 'Tasks', href: '/dashboard/projects/tasks', icon: CheckSquare, requiredPermission: 'projects:read' },
        { name: 'Kanban', href: '/dashboard/projects/kanban', icon: CheckSquare, requiredPermission: 'projects:read' },
        { name: 'Timeline', href: '/dashboard/projects/timeline', icon: Calendar, requiredPermission: 'projects:read' }
      ]
    },
    {
      name: 'Clients',
      href: '/dashboard/clients',
      icon: Users,
      requiredPermission: 'clients:read',
      children: [
        { name: 'All Clients', href: '/dashboard/clients', icon: Users },
        { name: 'Add Client', href: '/dashboard/clients/new', icon: Users, requiredPermission: 'clients:create' },
        { name: 'Client Portal', href: '/dashboard/clients/portal', icon: Shield, requiredPermission: 'clients:read' }
      ]
    },
    {
      name: 'Ledger & Tally',
      href: '/dashboard/ledger',
      icon: Database,
      requiredPermission: 'ledger:read',
      children: [
        { name: 'Ledger Entries', href: '/dashboard/ledger', icon: Database },
        { name: 'Tally Import', href: '/dashboard/ledger/import', icon: Database, requiredPermission: 'tally:import' },
        { name: 'Reconciliation', href: '/dashboard/ledger/reconciliation', icon: CheckSquare, requiredPermission: 'ledger:write' },
        { name: 'Reports', href: '/dashboard/ledger/reports', icon: BarChart3, requiredPermission: 'ledger:read' }
      ]
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      requiredPermission: 'analytics:read',
      children: [
        { name: 'Dashboard', href: '/dashboard/analytics', icon: PieChart },
        { name: 'Reports', href: '/dashboard/analytics/reports', icon: BarChart3, requiredPermission: 'analytics:read' },
        { name: 'Export', href: '/dashboard/analytics/export', icon: FileText, requiredPermission: 'analytics:export' }
      ]
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      requiredPermission: 'firm:read',
      children: [
        { name: 'Firm Information', href: '/dashboard/settings', icon: Building2 },
        { name: 'Users & Roles', href: '/dashboard/settings/users', icon: Users, requiredPermission: 'users:read' },
        { name: 'Security', href: '/dashboard/settings/security', icon: Shield, requiredPermission: 'firm:update' },
        { name: 'Integrations', href: '/dashboard/settings/integrations', icon: Database, requiredPermission: 'integrations:read' },
        { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Calendar, requiredPermission: 'firm:update' },
        { name: 'Audit Logs', href: '/dashboard/settings/audit', icon: FileText, requiredPermission: 'audit:read' }
      ]
    }
  ]

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    if (!hasPermission(item.requiredPermission)) return null

    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedSections.includes(item.name.toLowerCase().replace(/\s+/g, '-'))
    const hasVisibleChildren = hasChildren && item.children!.some(child => hasPermission(child.requiredPermission))

    if (hasChildren && hasVisibleChildren) {
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleSection(item.name.toLowerCase().replace(/\s+/g, '-'))}
            className={cn(
              "group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
              "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-white",
              level > 0 && !collapsed && "ml-4"
            )}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.name}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                )}
              </>
            )}
          </button>
          
          {isExpanded && !collapsed && (
            <div className="ml-4 space-y-1">
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <button
        key={item.name}
        onClick={() => handleNavigation(item.href)}
        title={collapsed ? item.name : undefined}
        className={cn(
          "group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-blue-100/80 text-blue-900 dark:bg-blue-900/80 dark:text-blue-100"
            : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-white",
          level > 0 && !collapsed && "ml-4"
        )}
      >
        <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed ? "mx-auto" : "mr-3")} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.name}</span>
            {item.badge && (
              <span className="ml-auto inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    )
  }

  const SidebarContent = () => (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300 ease-in-out relative",
      "bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-r border-white/20 dark:border-gray-800/50",
      "shadow-2xl shadow-gray-900/10 dark:shadow-gray-900/30",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/20 dark:border-gray-800/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">Ledgerfy</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map(item => renderNavigationItem(item))}
      </nav>

      {/* Unified circular toggle button - positioned at top edge, same level as logo */}
      {onToggleCollapse && (
        <div className={cn(
          "absolute top-4 transition-all duration-300 ease-in-out",
          collapsed ? "-right-5" : "-right-5"
        )}>
          <Button
            variant="default"
            size="icon"
            onClick={onToggleCollapse}
            className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl border-2 border-white/20 dark:border-blue-400/30 hover:scale-105 transition-all duration-200"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className={cn(
              "transition-transform duration-300",
              collapsed ? "rotate-0" : "rotate-180"
            )}>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/50 shadow-2xl shadow-gray-900/20">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Ledgerfy</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map(item => renderNavigationItem(item))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}
