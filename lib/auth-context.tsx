'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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
  refreshToken: () => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if we have a stored token
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }

      // Verify token and get user data
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token is invalid, try to refresh
        const refreshed = await refreshToken()
        if (!refreshed) {
          // Refresh failed, clear everything and redirect to login
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          router.push('/login')
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      setError('Authentication check failed')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store token and user data
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setUser(data.user)
        router.push('/dashboard')
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Login failed')
        return false
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error during login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to invalidate refresh token
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
    } catch (err) {
      console.error('Logout API error:', err)
    } finally {
      // Clear local storage and state
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      setUser(null)
      router.push('/login')
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update stored token and user data
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setUser(data.user)
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error('Token refresh failed:', err)
      return false
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false
    return permissions.some(permission => user.permissions.includes(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false
    return permissions.every(permission => user.permissions.includes(permission))
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    updateUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
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
