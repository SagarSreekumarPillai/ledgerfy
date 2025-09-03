'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
  TrendingUp,
  Menu,
  Search,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavigationItem[]
  requiredPermission?: string
  description?: string
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
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard'])
  const [searchQuery, setSearchQuery] = useState('')

  // Auto-expand sections based on current path
  useEffect(() => {
    const currentSection = navigation.find(item => 
      pathname.startsWith(item.href) || 
      item.children?.some(child => pathname.startsWith(child.href))
    )
    
    if (currentSection && !expandedSections.includes(currentSection.name.toLowerCase().replace(/\s+/g, '-'))) {
      setExpandedSections(prev => [...prev, currentSection.name.toLowerCase().replace(/\s+/g, '-')])
    }
  }, [pathname, expandedSections])

  const hasPermission = (permission?: string) => {
    if (!permission) return true
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

  const handleMobileNavigation = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      requiredPermission: 'dashboard:read',
      description: 'Overview and key metrics'
    },
    {
      name: 'Document Management',
      href: '/dashboard/documents',
      icon: FileText,
      requiredPermission: 'documents:read',
      description: 'Files, versions, and sharing',
      children: [
        { name: 'All Documents', href: '/dashboard/documents', icon: FileText, description: 'Browse all files' },
        { name: 'Upload', href: '/dashboard/documents/upload', icon: FileText, requiredPermission: 'documents:upload', description: 'Add new files' },
        { name: 'Shared', href: '/dashboard/documents/shared', icon: FileText, requiredPermission: 'documents:share', description: 'Shared with you' },
        { name: 'Templates', href: '/dashboard/documents/templates', icon: FileText, requiredPermission: 'documents:read', description: 'Document templates' }
      ]
    },
    {
      name: 'Compliance',
      href: '/dashboard/compliance',
      icon: Calendar,
      requiredPermission: 'compliance:read',
      description: 'Deadlines and requirements',
      children: [
        { name: 'Overview', href: '/dashboard/compliance', icon: Calendar, description: 'Compliance dashboard' },
        { name: 'Calendar', href: '/dashboard/compliance/calendar', icon: Calendar, requiredPermission: 'compliance:read', description: 'Timeline view' },
        { name: 'Templates', href: '/dashboard/compliance/templates', icon: CheckSquare, requiredPermission: 'compliance:read', description: 'Compliance templates' },
        { name: 'Reports', href: '/dashboard/compliance/reports', icon: BarChart3, requiredPermission: 'compliance:read', description: 'Compliance reports' }
      ]
    },
    {
      name: 'Projects & Tasks',
      href: '/dashboard/projects',
      icon: Briefcase,
      requiredPermission: 'projects:read',
      description: 'Project management',
      children: [
        { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen, description: 'All projects' },
        { name: 'Tasks', href: '/dashboard/projects/tasks', icon: CheckSquare, requiredPermission: 'projects:read', description: 'Task management' },
        { name: 'Kanban', href: '/dashboard/projects/kanban', icon: CheckSquare, requiredPermission: 'projects:read', description: 'Kanban board' },
        { name: 'Timeline', href: '/dashboard/projects/timeline', icon: Calendar, requiredPermission: 'projects:read', description: 'Project timeline' }
      ]
    },
    {
      name: 'Clients',
      href: '/dashboard/clients',
      icon: Users,
      requiredPermission: 'clients:read',
      description: 'Client management',
      children: [
        { name: 'All Clients', href: '/dashboard/clients', icon: Users, description: 'Client directory' },
        { name: 'Add Client', href: '/dashboard/clients/new', icon: Users, requiredPermission: 'clients:create', description: 'Create new client' },
        { name: 'Client Portal', href: '/dashboard/clients/portal', icon: Shield, requiredPermission: 'clients:read', description: 'Client access' }
      ]
    },
    {
      name: 'Ledger & Tally',
      href: '/dashboard/ledger',
      icon: Database,
      requiredPermission: 'ledger:read',
      description: 'Financial records',
      children: [
        { name: 'Ledger Entries', href: '/dashboard/ledger', icon: Database, description: 'All entries' },
        { name: 'Tally Import', href: '/dashboard/ledger/import', icon: Database, requiredPermission: 'tally:import', description: 'Import from Tally' },
        { name: 'Reconciliation', href: '/dashboard/ledger/reconciliation', icon: CheckSquare, requiredPermission: 'ledger:write', description: 'Account reconciliation' },
        { name: 'Reports', href: '/dashboard/ledger/reports', icon: BarChart3, requiredPermission: 'ledger:read', description: 'Financial reports' }
      ]
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      requiredPermission: 'analytics:read',
      description: 'Business intelligence',
      children: [
        { name: 'Dashboard', href: '/dashboard/analytics', icon: PieChart, description: 'Analytics overview' },
        { name: 'Reports', href: '/dashboard/analytics/reports', icon: BarChart3, requiredPermission: 'analytics:read', description: 'Custom reports' },
        { name: 'Export', href: '/dashboard/analytics/export', icon: FileText, requiredPermission: 'analytics:export', description: 'Export data' }
      ]
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      requiredPermission: 'firm:read',
      description: 'System configuration',
      children: [
        { name: 'Firm Information', href: '/dashboard/settings', icon: Building2, description: 'Company details' },
        { name: 'Users & Roles', href: '/dashboard/settings/users', icon: Users, requiredPermission: 'users:read', description: 'User management' },
        { name: 'Security', href: '/dashboard/settings/security', icon: Shield, requiredPermission: 'firm:update', description: 'Security settings' },
        { name: 'Integrations', href: '/dashboard/settings/integrations', icon: Database, requiredPermission: 'integrations:read', description: 'Third-party apps' },
        { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Calendar, requiredPermission: 'firm:update', description: 'Notification preferences' },
        { name: 'Audit Logs', href: '/dashboard/settings/audit', icon: FileText, requiredPermission: 'audit:read', description: 'System audit trail' }
      ]
    }
  ]

  // Filter navigation based on search query
  const filteredNavigation = navigation.filter(item => {
    if (!hasPermission(item.requiredPermission)) return false
    
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.children?.some(child => 
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    return matchesSearch
  })

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
              "group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
              level > 0 && "ml-3",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0 transition-colors",
              "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
            )} />
            {!collapsed && (
              <>
                <span className="ml-3 flex-1 text-left">{item.name}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform" />
                )}
              </>
            )}
          </button>
          
          {isExpanded && !collapsed && (
            <div className="ml-3 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={handleMobileNavigation}
        className={cn(
          "group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
          level > 0 && "ml-3",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? item.name : undefined}
      >
        <item.icon className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors",
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
        )} />
        {!collapsed && (
          <>
            <span className="ml-3 flex-1 text-left">{item.name}</span>
            {item.badge && (
              <span className="ml-auto inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    )
  }

  const SidebarContent = () => (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">Ledgerfy</span>
          )}
        </div>
        {!collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-3 overflow-y-auto">
        {filteredNavigation.map(item => renderNavigationItem(item))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Command className="h-3 w-3" />
            <span>⌘K for quick access</span>
          </div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>
    </>
  )
}
