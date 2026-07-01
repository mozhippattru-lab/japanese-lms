import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Pages/endpoints reachable without logging in (landing + the whole auth flow).
  const PUBLIC_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/privacy', '/terms', '/api/auth']
  // SEO / crawler files must never redirect to login.
  const PUBLIC_EXACT = ['/sitemap.xml', '/robots.txt', '/manifest.webmanifest', '/opengraph-image', '/twitter-image', '/favicon.ico']
  const isPublic =
    pathname === '/' ||
    PUBLIC_EXACT.includes(pathname) ||
    pathname.startsWith('/opengraph-image') ||
    PUBLIC_PREFIXES.some(p => pathname.startsWith(p))

  // Redirect unauthenticated users to login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages.
  // NOTE: '/' is the public marketing website — keep it visible to everyone
  // (logged-in users included), so it is intentionally NOT redirected here.
  if (user && (pathname === '/login' || pathname === '/register')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'student'
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
