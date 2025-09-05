import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/api/users', '/api/roles']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  if (isPublicRoute) {
    // For public routes, redirect to dashboard if already authenticated
    const token = request.cookies.get('accessToken')?.value
    
    if (token) {
      try {
        // Verify token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        await jwtVerify(token, secret)
        
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (error) {
        // Token is invalid, remove it and continue to public route
        const response = NextResponse.next()
        response.cookies.delete('accessToken')
        response.cookies.delete('refreshToken')
        return response
      }
    }
    
    return NextResponse.next()
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const token = request.cookies.get('accessToken')?.value
    
    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verify token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      
      // Add user info to headers for API routes
      if (pathname.startsWith('/api/')) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', payload.userId as string)
        requestHeaders.set('x-user-email', payload.email as string)
        requestHeaders.set('x-firm-id', payload.firmId as string)
        requestHeaders.set('x-role-id', payload.roleId as string)
        
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }
      
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('accessToken', '', { expires: new Date(0) })
      response.cookies.set('refreshToken', '', { expires: new Date(0) })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}

