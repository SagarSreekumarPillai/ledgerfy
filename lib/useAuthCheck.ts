'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
}

export function useAuthCheck(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (isMounted) {
          if (response.ok) {
            const data = await response.json()
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user: data.user
            })
          } else {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null
            })
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (isMounted) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          })
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  return authState
}

