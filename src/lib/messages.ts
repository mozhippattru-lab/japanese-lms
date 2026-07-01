import { sql } from '@/lib/db'

export type Contact = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  jlpt_level: string | null
  role: string
}

export type Message = {
  id: string
  sender_id: string
  recipient_id: string
  body: string
  read_at: string | null
  created_at: string
}

export type MessagingData = {
  contacts: Contact[]
  messages: Message[]
  parties: Record<string, Contact> // id -> profile, for everyone in a conversation
}

// Resolve who a user may message, all their messages, and the profiles of
// everyone they've talked to. Server only.
export async function loadMessagingData(userId: string, role: string): Promise<MessagingData> {
  // ── contacts ──────────────────────────────────────────────
  let contactIds: string[] = []
  if (role === 'teacher') {
    const batches = await sql`select id from batches where teacher_id = ${userId}`
    const batchIds = batches.map(b => b.id as string)
    if (batchIds.length) {
      const enr = await sql`select student_id from student_batches where batch_id = any(${batchIds})`
      contactIds = [...new Set(enr.map(e => e.student_id as string))]
    }
  } else if (role === 'student') {
    const myb = await sql`select batch_id from student_batches where student_id = ${userId}`
    const batchIds = [...new Set(myb.map(b => b.batch_id as string))]
    if (batchIds.length) {
      const batches = await sql`select teacher_id from batches where id = any(${batchIds})`
      contactIds = [...new Set(batches.map(b => b.teacher_id as string).filter(Boolean))]
    }
  }

  // everyone can message the office (admins)
  const adminList = await sql<Contact[]>`
    select id, full_name, email, avatar_url, jlpt_level, role from profiles where role = 'admin'
  `

  let roleContacts: Contact[] = []
  if (contactIds.length) {
    roleContacts = await sql<Contact[]>`
      select id, full_name, email, avatar_url, jlpt_level, role from profiles
      where id = any(${contactIds}) order by full_name
    `
  }

  const contacts = [...roleContacts, ...adminList].filter((c, i, arr) =>
    c.id !== userId && arr.findIndex(x => x.id === c.id) === i)

  // ── messages ──────────────────────────────────────────────
  const messages = await sql<Message[]>`
    select id, sender_id, recipient_id, body, read_at, created_at from messages
    where sender_id = ${userId} or recipient_id = ${userId}
    order by created_at asc
  `

  // ── party profiles (contacts + anyone in a conversation) ──
  const parties: Record<string, Contact> = {}
  for (const c of contacts) parties[c.id] = c
  const missing = [...new Set(messages.flatMap(m => [m.sender_id, m.recipient_id]))]
    .filter(id => id !== userId && !parties[id])
  if (missing.length) {
    const more = await sql<Contact[]>`
      select id, full_name, email, avatar_url, jlpt_level, role from profiles where id = any(${missing})
    `
    for (const p of more) parties[p.id] = p
  }

  return { contacts, messages: messages as unknown as Message[], parties }
}
