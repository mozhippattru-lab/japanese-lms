import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Supabase password-reset emails redirect to the Site URL (/) with ?code=
  // because the allowlist strips the /reset-password path. Catch it here and
  // forward to the actual reset-password page so the code exchange can happen.
  if (pathname === '/' && searchParams.get('code')) {
    const url = request.nextUrl.clone()
    url.pathname = '/reset-password'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
