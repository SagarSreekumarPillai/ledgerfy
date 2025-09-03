'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  name: string
  href: string
  current: boolean
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable name
      let name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Special cases for better readability
      const nameMap: Record<string, string> = {
        'dashboard': 'Dashboard',
        'dms': 'Document Management',
        'compliance': 'Compliance',
        'projects': 'Projects & Tasks',
        'clients': 'Clients',
        'ledger': 'Ledger & Tally',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'users': 'Users & Roles',
        'security': 'Security',
        'integrations': 'Integrations',
        'notifications': 'Notifications',
        'audit': 'Audit Logs',
        'documents': 'Documents',
        'upload': 'Upload',
        'shared': 'Shared',
        'templates': 'Templates',
        'calendar': 'Calendar',
        'reports': 'Reports',
        'tasks': 'Tasks',
        'kanban': 'Kanban',
        'timeline': 'Timeline',
        'new': 'Add New',
        'portal': 'Portal',
        'import': 'Import',
        'reconciliation': 'Reconciliation',
        'export': 'Export'
      }
      
      name = nameMap[segment] || name
      
      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === segments.length - 1
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length === 0) {
    return null
  }
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            {breadcrumb.current ? (
              <span
                className={cn(
                  "text-sm font-medium text-gray-900 dark:text-white",
                  "cursor-default"
                )}
                aria-current="page"
              >
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className={cn(
                  "text-sm font-medium text-gray-500 hover:text-gray-700",
                  "dark:text-gray-400 dark:hover:text-gray-300",
                  "transition-colors duration-200"
                )}
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
