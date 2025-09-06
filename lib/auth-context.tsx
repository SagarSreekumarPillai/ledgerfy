'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  firmId: string
  roleId: string
  permissions: string[]
  mfaEnabled: boolean
  isActive: boolean
  isEmailVerified: boolean
  lastLogin: string
  preferences: {
    theme?: 'light' | 'dark' | 'system'
    language?: string
    timezone?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Frontend auth check started')
        setLoading(true)
        const response = await fetch('/api/auth/me')
        console.log('📊 Frontend auth check response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('📊 Frontend auth check success, user:', data.user)
          setUser(data.user)
        } else {
          console.log('❌ Frontend auth check failed, clearing user')
          // If the response is not ok, clear user state
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Frontend auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔍 Frontend login attempt started for:', email)
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      console.log('📊 Frontend response status:', response.status)
      console.log('📊 Frontend response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('📊 Frontend login success, user data:', data.user)
        setUser(data.user)
        
        // The server sets HTTP-only cookies, so we just need to redirect
        console.log('🔄 Redirecting to dashboard...')
        router.push('/dashboard')
        return true
      } else {
        const errorData = await response.json()
        console.log('❌ Frontend login failed:', errorData)
        setError(errorData.error || 'Login failed')
        return false
      }
    } catch (err) {
      console.error('❌ Frontend login error:', err)
      setError('Network error during login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      
      // Clear user state immediately
      setUser(null)
      
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Force redirect to login page
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, ensure user is logged out locally
      setUser(null)
      router.push('/login')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return user?.permissions?.some(permission => permissions.includes(permission)) || false
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return user?.permissions?.every(permission => permissions.includes(permission)) || false
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

