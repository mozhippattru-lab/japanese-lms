import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { sql } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

// Public registration — always creates a student. Role is never trusted from
// the client.
export async function POST(req: Request) {
  const { name, email, password, college_id } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const settings = await sql<{ new_registrations_open: boolean | null }[]>`
    select new_registrations_open from app_settings where id = 'default' limit 1
  `
  if (settings[0]?.new_registrations_open === false) {
    return NextResponse.json({ error: 'New registrations are currently closed.' }, { status: 403 })
  }

  const clean = String(email).trim()
  const existing = await sql`select 1 from auth.users where lower(email) = lower(${clean}) limit 1`
  if (existing.length) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const id = randomUUID()
  const hash = await hashPassword(password)
  await sql.begin(async (tx) => {
    await tx`insert into auth.users (id, email, encrypted_password) values (${id}, ${clean}, ${hash})`
    await tx`
      insert into profiles (id, full_name, email, role, status)
      values (${id}, ${name}, ${clean}, 'student', 'Active')
      on conflict (id) do update set full_name = excluded.full_name, email = excluded.email
    `
    if (college_id) {
      await tx`update profiles set college_id = ${college_id} where id = ${id}`
    }
  })

  await createSession(id)
  return NextResponse.json({ role: 'student' })
}
