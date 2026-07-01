import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword, createSession, pruneExpiredSessions } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const rows = await sql<{ id: string; encrypted_password: string | null; role: string }[]>`
    select u.id, u.encrypted_password, coalesce(p.role, 'student') as role
    from auth.users u
    left join profiles p on p.id = u.id
    where lower(u.email) = lower(${String(email).trim()})
    limit 1
  `
  const user = rows[0]
  // Generic message — never reveal whether the email exists.
  if (!user || !user.encrypted_password || !(await verifyPassword(password, user.encrypted_password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  await createSession(user.id)
  pruneExpiredSessions().catch(() => {})
  return NextResponse.json({ role: user.role })
}
