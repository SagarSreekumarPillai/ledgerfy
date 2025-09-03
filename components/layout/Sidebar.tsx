'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
  TestTube
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
}

export function Sidebar({ sidebarOpen, setSidebarOpen, userPermissions = [] }: SidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard'])

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    return userPermissions.includes(permission)
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
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
      icon: CheckSquare,
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
      icon: PieChart,
      requiredPermission: 'analytics:read',
      children: [
        { name: 'Dashboard', href: '/dashboard/analytics', icon: PieChart },
        { name: 'Reports', href: '/dashboard/analytics/reports', icon: BarChart3, requiredPermission: 'analytics:read' },
        { name: 'Export', href: '/dashboard/analytics/export', icon: FileText, requiredPermission: 'analytics:export' }
      ]
    },
    {
      name: 'Testing',
      href: '/dashboard/testing',
      icon: TestTube,
      requiredPermission: 'testing:read',
      children: [
        { name: 'Test Suite', href: '/dashboard/testing', icon: TestTube },
        { name: 'System Health', href: '/dashboard/testing/health', icon: Shield, requiredPermission: 'testing:read' },
        { name: 'Reports', href: '/dashboard/testing/reports', icon: FileText, requiredPermission: 'testing:read' }
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
              "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
              level > 0 && "ml-4"
            )}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">{item.name}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
          
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <a
        key={item.name}
        href={item.href}
        className={cn(
          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
          level > 0 && "ml-4"
        )}
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="ml-auto inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {item.badge}
          </span>
        )}
      </a>
    )
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Ledgerfy</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map(item => renderNavigationItem(item))}
          </nav>
        </div>
      </div>
    </>
  )
}
