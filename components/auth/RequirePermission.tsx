'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth-context'

interface RequirePermissionProps {
  children: ReactNode
  permission?: string
  permissions?: string[]
  requireAny?: boolean
  requireAll?: boolean
  fallback?: ReactNode
  showFallback?: boolean
}

export function RequirePermission({
  children,
  permission,
  permissions = [],
  requireAny = false,
  requireAll = false,
  fallback = null,
  showFallback = false
}: RequirePermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth()

  // Single permission check
  if (permission && !hasPermission(permission)) {
    return showFallback ? <>{fallback}</> : null
  }

  // Multiple permissions check
  if (permissions.length > 0) {
    let hasAccess = false

    if (requireAny) {
      hasAccess = hasAnyPermission(permissions)
    } else if (requireAll) {
      hasAccess = hasAllPermissions(permissions)
    } else {
      // Default: require all permissions
      hasAccess = hasAllPermissions(permissions)
    }

    if (!hasAccess) {
      return showFallback ? <>{fallback}</> : null
    }
  }

  return <>{children}</>
}

// Convenience components for common permission patterns
export function RequireAnyPermission({
  children,
  permissions,
  fallback,
  showFallback = false
}: Omit<RequirePermissionProps, 'permission' | 'requireAny' | 'requireAll'>) {
  return (
    <RequirePermission
      permissions={permissions}
      requireAny={true}
      fallback={fallback}
      showFallback={showFallback}
    >
      {children}
    </RequirePermission>
  )
}

export function RequireAllPermissions({
  children,
  permissions,
  fallback,
  showFallback = false
}: Omit<RequirePermissionProps, 'permission' | 'requireAny' | 'requireAll'>) {
  return (
    <RequirePermission
      permissions={permissions}
      requireAll={true}
      fallback={fallback}
      showFallback={showFallback}
    >
      {children}
    </RequirePermission>
  )
}

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RequirePermissionProps, 'children'> = {}
) {
  return function PermissionedComponent(props: P) {
    return (
      <RequirePermission {...options}>
        <Component {...props} />
      </RequirePermission>
    )
  }
}
