'use server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import type { Message } from '@/lib/messages'

export async function pollMessages(): Promise<Message[]> {
  const me = await getSessionUser()
  if (!me) return []
  const rows = await sql`
    select id, sender_id, recipient_id, body, read_at, created_at from messages
    where sender_id = ${me.id} or recipient_id = ${me.id}
    order by created_at asc
  `
  return rows as unknown as Message[]
}

export async function markMessagesRead(ids: string[]): Promise<void> {
  const me = await getSessionUser()
  if (!me || !ids.length) return
  await sql`update messages set read_at = now() where id = any(${ids}) and recipient_id = ${me.id}`
}

export async function sendMessage(recipientId: string, body: string): Promise<Message | null> {
  const me = await getSessionUser()
  if (!me) return null
  const [row] = await sql`
    insert into messages (sender_id, recipient_id, body)
    values (${me.id}, ${recipientId}, ${body})
    returning id, sender_id, recipient_id, body, read_at, created_at
  `
  return (row as unknown as Message) || null
}
