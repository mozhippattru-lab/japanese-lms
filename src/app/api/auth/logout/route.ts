import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

export async function POST(req: Request) {
  await destroySession()
  // Redirect (303) so native form posts land on /login; fetch callers simply
  // follow it and then navigate client-side.
  return NextResponse.redirect(new URL('/login', req.url), { status: 303 })
}
