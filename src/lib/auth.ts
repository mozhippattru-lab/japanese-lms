import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { sql } from './db'

export const SESSION_COOKIE = 'session'
const SESSION_DAYS = 30

export type SessionUser = {
  id: string
  email: string
  role: string
  full_name: string | null
}

// ── Passwords ──────────────────────────────────────────────────────────────
// Supabase stores bcrypt hashes ($2a$…); bcryptjs verifies them, so migrated
// users keep their existing passwords.
export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// ── Sessions ───────────────────────────────────────────────────────────────
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000)
  await sql`
    insert into sessions (token, user_id, expires_at)
    values (${token}, ${userId}, ${expires})
  `
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  })
  return token
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) await sql`delete from sessions where token = ${token}`
  store.delete(SESSION_COOKIE)
}

// Resolve the current user from the session cookie. Server-only (queries PG).
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const rows = await sql<SessionUser[]>`
    select u.id, u.email, coalesce(p.role, 'student') as role, p.full_name
    from sessions s
    join auth.users u on u.id = s.user_id
    left join profiles p on p.id = u.id
    where s.token = ${token} and s.expires_at > now()
    limit 1
  `
  return rows[0] ?? null
}

// Guard for server components / route handlers / server actions.
// Redirects to /login if unauthenticated, or to the user's own dashboard if
// their role isn't allowed.
export async function requireUser(role?: string | string[]): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  if (role) {
    const allowed = Array.isArray(role) ? role : [role]
    if (!allowed.includes(user.role)) redirect(`/dashboard/${user.role || 'student'}`)
  }
  return user
}

// Purge expired sessions (call opportunistically, e.g. on login).
export async function pruneExpiredSessions(): Promise<void> {
  await sql`delete from sessions where expires_at < now()`
}
