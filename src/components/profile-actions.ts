'use server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// A user can only update their own profile (id is taken from the session).
export async function updateOwnProfile(data: { full_name: string; phone: string | null; avatar_url: string | null }) {
  const me = await getSessionUser()
  if (!me) return { error: 'Not authenticated' }
  try {
    await sql`
      update profiles set full_name = ${data.full_name}, phone = ${data.phone}, avatar_url = ${data.avatar_url}
      where id = ${me.id}
    `
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
