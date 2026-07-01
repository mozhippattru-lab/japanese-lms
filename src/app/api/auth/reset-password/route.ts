import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const { token, password } = await req.json()
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const rows = await sql<{ user_id: string }[]>`
    select user_id from password_reset_tokens
    where token = ${token} and used = false and expires_at > now()
    limit 1
  `
  if (!rows[0]) {
    return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
  }

  const hash = await hashPassword(password)
  await sql.begin(async (tx) => {
    await tx`update auth.users set encrypted_password = ${hash} where id = ${rows[0].user_id}`
    await tx`update password_reset_tokens set used = true where token = ${token}`
    // Invalidate all existing sessions for this user after a password change.
    await tx`delete from sessions where user_id = ${rows[0].user_id}`
  })

  return NextResponse.json({ ok: true })
}
