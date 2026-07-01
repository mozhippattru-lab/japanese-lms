import { NextResponse, type NextRequest } from 'next/server'

// Session cookie name (kept in sync with src/lib/auth.ts). Hard-coded here so
// this file stays free of Node-only imports and can run on the edge.
const SESSION_COOKIE = 'session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)

  // Public marketing + auth flow + crawler files — reachable without a session.
  const PUBLIC_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/privacy', '/terms', '/blog', '/api/auth', '/api/colleges', '/api/demo-request']
  const PUBLIC_EXACT = ['/sitemap.xml', '/robots.txt', '/manifest.webmanifest', '/opengraph-image', '/twitter-image', '/favicon.ico']
  const isPublic =
    pathname === '/' ||
    PUBLIC_EXACT.includes(pathname) ||
    pathname.startsWith('/opengraph-image') ||
    PUBLIC_PREFIXES.some(p => pathname.startsWith(p))

  // Redirect unauthenticated users to login. (Cookie presence only — the pages
  // themselves validate the session against the DB via requireUser().)
  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged-in users shouldn't sit on the auth pages — bounce them to the
  // dashboard dispatcher, which resolves their role server-side.
  if (hasSession && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
