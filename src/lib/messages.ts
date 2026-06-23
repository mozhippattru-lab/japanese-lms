import { createAdminClient } from '@/lib/supabase/admin'

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

const SEL = 'id, full_name, email, avatar_url, jlpt_level, role'

// Resolve who a user may message, all their messages, and the profiles of
// everyone they've talked to. Uses the service role (server only).
export async function loadMessagingData(userId: string, role: string): Promise<MessagingData> {
  const sb = createAdminClient()

  // ── contacts ──────────────────────────────────────────────
  let contactIds: string[] = []
  if (role === 'teacher') {
    const { data: batches } = await sb.from('batches').select('id').eq('teacher_id', userId)
    const batchIds = (batches || []).map(b => b.id)
    if (batchIds.length) {
      const { data: enr } = await sb.from('student_batches').select('student_id').in('batch_id', batchIds)
      contactIds = [...new Set((enr || []).map(e => e.student_id as string))]
    }
  } else if (role === 'student') {
    const { data: myb } = await sb.from('student_batches').select('batch_id').eq('student_id', userId)
    const batchIds = [...new Set((myb || []).map(b => b.batch_id as string))]
    if (batchIds.length) {
      const { data: batches } = await sb.from('batches').select('teacher_id').in('id', batchIds)
      contactIds = [...new Set((batches || []).map(b => b.teacher_id).filter(Boolean) as string[])]
    }
  }

  // everyone can message the office (admins)
  const { data: admins } = await sb.from('profiles').select(SEL).eq('role', 'admin')
  const adminList = (admins || []) as Contact[]

  let roleContacts: Contact[] = []
  if (contactIds.length) {
    const { data } = await sb.from('profiles').select(SEL).in('id', contactIds).order('full_name')
    roleContacts = (data || []) as Contact[]
  }

  const contacts = [...roleContacts, ...adminList].filter((c, i, arr) =>
    c.id !== userId && arr.findIndex(x => x.id === c.id) === i)

  // ── messages ──────────────────────────────────────────────
  const { data: msgs } = await sb
    .from('messages')
    .select('id, sender_id, recipient_id, body, read_at, created_at')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: true })
  const messages = (msgs || []) as Message[]

  // ── party profiles (contacts + anyone in a conversation) ──
  const parties: Record<string, Contact> = {}
  for (const c of contacts) parties[c.id] = c
  const missing = [...new Set(messages.flatMap(m => [m.sender_id, m.recipient_id]))]
    .filter(id => id !== userId && !parties[id])
  if (missing.length) {
    const { data } = await sb.from('profiles').select(SEL).in('id', missing)
    for (const p of (data || []) as Contact[]) parties[p.id] = p
  }

  return { contacts, messages, parties }
}
