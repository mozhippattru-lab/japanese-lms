import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { sql } from '@/lib/db'
import { getSessionUser, hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (me.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const body = await req.json()
  const { full_name, email, phone, password, jlpt_level, status } = body
  if (!full_name || !email || !password) return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  if (String(password).length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const clean = String(email).trim()
  const existing = await sql`select 1 from auth.users where lower(email) = lower(${clean}) limit 1`
  if (existing.length) return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })

  const id = randomUUID()
  const hash = await hashPassword(password)
  const profile = {
    id, full_name, email: clean, phone: phone || null,
    role: 'teacher', jlpt_level: jlpt_level || null, status: status || 'Active',
  }

  try {
    await sql.begin(async (tx) => {
      await tx`insert into auth.users (id, email, encrypted_password) values (${id}, ${clean}, ${hash})`
      await tx`
        insert into profiles (id, full_name, email, phone, role, jlpt_level, status)
        values (${id}, ${full_name}, ${clean}, ${phone || null}, 'teacher', ${jlpt_level || null}, ${status || 'Active'})
      `
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  return NextResponse.json({ teacher: { ...profile, created_at: new Date().toISOString() } })
}
