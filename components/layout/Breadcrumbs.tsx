'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Always start with home
    breadcrumbs.push({
      name: 'Home',
      href: '/dashboard',
      current: segments.length === 1 && segments[0] === 'dashboard'
    })
    
    // Build breadcrumbs from path segments
    let currentPath = '/dashboard'
    segments.forEach((segment, index) => {
      if (segment === 'dashboard') return // Skip dashboard segment
      
      currentPath += `/${segment}`
      
      // Convert segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === segments.length - 1
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length <= 1) return null
  
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" aria-hidden="true" />
            )}
            
            {breadcrumb.current ? (
              <span
                aria-current="page"
                className="text-gray-900 dark:text-white font-medium"
              >
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {breadcrumb.name === 'Home' ? (
                  <Home className="h-4 w-4" />
                ) : (
                  breadcrumb.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
