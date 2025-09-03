'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Loader2, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requireAnyPermission?: string[]
  requireAllPermissions?: string[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requireAnyPermission = [],
  requireAllPermissions = [],
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, hasPermission, hasAnyPermission: hasAny, hasAllPermissions: hasAll } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [loading, user, router, redirectTo])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Please wait while we verify your authentication
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    return null // Will redirect in useEffect
  }

  // Check required permissions
  if (requiredPermissions.length > 0 && !requiredPermissions.every(permission => hasPermission(permission))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have the required permissions to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user has any of the required permissions
  if (requireAnyPermission.length > 0 && !hasAny(requireAnyPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-600" />
            </div>
            <CardTitle>Insufficient Permissions</CardTitle>
            <CardDescription>
              You need at least one of the following permissions to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {requireAnyPermission.join(', ')}
            </div>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user has all of the required permissions
  if (requireAllPermissions.length > 0 && !hasAll(requireAllPermissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-600" />
            </div>
            <CardTitle>Insufficient Permissions</CardTitle>
            <CardDescription>
              You need all of the following permissions to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {requireAllPermissions.join(', ')}
            </div>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and has required permissions
  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
