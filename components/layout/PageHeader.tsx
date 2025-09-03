'use client'

import { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  showBreadcrumbs?: boolean
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  className,
  showBreadcrumbs = true 
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {showBreadcrumbs && <Breadcrumbs />}
      
      <div className="mt-4 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {children && (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

interface PageHeaderActionsProps {
  children: ReactNode
  className?: string
}

export function PageHeaderActions({ children, className }: PageHeaderActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {children}
    </div>
  )
}
