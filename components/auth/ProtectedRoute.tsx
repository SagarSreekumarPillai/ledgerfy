'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    // Only redirect if we've finished checking auth and have no user
    if (!loading && hasCheckedAuth && !user && !isRedirecting) {
      // Add a small delay to prevent rapid redirects
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        // Use replace instead of push to avoid adding to history
        router.replace('/login')
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [loading, user, router, isRedirecting, hasCheckedAuth])

  useEffect(() => {
    // Mark that we've checked auth once loading is complete
    if (!loading) {
      setHasCheckedAuth(true)
    }
  }, [loading])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    return null // Will redirect in useEffect
  }

  // User is authenticated, render children
  return <>{children}</>
}
