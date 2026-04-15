import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

const protectedRoutes = ['/dashboard', '/booking']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await getSessionFromRequest(req)

  // Redirect logged-in users away from auth pages
  if (authRoutes.some(r => pathname.startsWith(r))) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protected user routes
  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  // Admin routes
  if (adminRoutes.some(r => pathname.startsWith(r))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/booking/:path*', '/login', '/register'],
}
