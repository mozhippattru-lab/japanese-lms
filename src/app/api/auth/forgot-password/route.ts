import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { sql } from '@/lib/db'
import { sendPasswordReset } from '@/lib/email'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  const clean = String(email).trim()
  const rows = await sql<{ id: string }[]>`
    select id from auth.users where lower(email) = lower(${clean}) limit 1
  `
  if (rows[0]) {
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await sql`
      insert into password_reset_tokens (token, user_id, expires_at)
      values (${token}, ${rows[0].id}, ${expires})
    `
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://mozhippattru.org'
    try {
      await sendPasswordReset({ to: clean, url: `${base}/reset-password?token=${token}` })
    } catch {
      /* swallow — never reveal delivery status */
    }
  }

  // Always succeed so we never leak whether an account exists.
  return NextResponse.json({ ok: true })
}
