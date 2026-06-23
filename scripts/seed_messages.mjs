// Demo seeder for Messages. Run: node scripts/seed_messages.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = {}
for (const line of readFileSync(join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim()
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const pick = a => a[Math.floor(Math.random() * a.length)]
const minsAgo = n => new Date(Date.now() - n * 60000).toISOString()

const T2S = [ // teacher → student
  'Hi! Please remember to submit your kanji worksheet by Friday.',
  'Good work in class today — your pronunciation is improving!',
  'Don’t forget we have a mock test next week.',
  'Can you review lesson 5 before our next session?',
]
const S2T = [ // student → teacher
  'Thank you sensei! I will submit it tonight.',
  'Could you share the notes from today’s class?',
  'I had a doubt in the te-form, can you explain again?',
  'Okay sensei, I’ll prepare for the test.',
]
const S2A = 'Hello, I need a receipt for my last fee payment. Could you help?'
const A2S = 'Sure! I’ll email your receipt shortly. Thank you.'

const rows = []
const { data: teachers } = await sb.from('profiles').select('id').eq('role', 'teacher')
const { data: admins } = await sb.from('profiles').select('id').eq('role', 'admin')
const adminId = admins?.[0]?.id

for (const t of teachers || []) {
  const { data: batches } = await sb.from('batches').select('id').eq('teacher_id', t.id)
  const batchIds = (batches || []).map(b => b.id)
  if (!batchIds.length) continue
  const { data: enr } = await sb.from('student_batches').select('student_id').in('batch_id', batchIds).limit(3)
  const studentIds = [...new Set((enr || []).map(e => e.student_id))]
  for (const sid of studentIds) {
    // a short back-and-forth thread
    rows.push({ sender_id: t.id, recipient_id: sid, body: pick(T2S), read_at: minsAgo(180), created_at: minsAgo(200) })
    rows.push({ sender_id: sid, recipient_id: t.id, body: pick(S2T), read_at: minsAgo(150), created_at: minsAgo(170) })
    rows.push({ sender_id: t.id, recipient_id: sid, body: pick(T2S), read_at: null, created_at: minsAgo(30) }) // unread by student
  }
  // one student → office (admin) thread
  if (adminId && studentIds[0]) {
    rows.push({ sender_id: studentIds[0], recipient_id: adminId, body: S2A, read_at: minsAgo(60), created_at: minsAgo(80) })
    rows.push({ sender_id: adminId, recipient_id: studentIds[0], body: A2S, read_at: null, created_at: minsAgo(55) })
  }
}

if (rows.length) {
  const { error } = await sb.from('messages').insert(rows)
  if (error) console.error(error.message)
}
console.log(`Done. Inserted ${rows.length} demo messages.`)
