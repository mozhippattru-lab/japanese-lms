// Demo seeder for the College / multi-channel feature.
// Run:  node scripts/seed_colleges.mjs
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

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = a => a[rand(0, a.length - 1)]
const isoDay = d => d.toISOString().slice(0, 10)
const monthsAgo = n => { const d = new Date(); d.setMonth(d.getMonth() - n); return d }
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()
const PW = 'Demo@1234'

const COLLEGES = [
  { name: 'PSG College of Technology', category: 'Engineering', city: 'Coimbatore', contact_person: 'Dr. Ramesh', amount: 45000, level: 'N5' },
  { name: 'Stella Maris College', category: 'Arts & Science', city: 'Chennai', contact_person: 'Prof. Anitha', amount: 36000, level: 'N5' },
  { name: 'Loyola College', category: 'Commerce', city: 'Chennai', contact_person: 'Fr. Xavier', amount: 40000, level: 'N4' },
  { name: 'KMCH Institute', category: 'Medical', city: 'Coimbatore', contact_person: 'Dr. Priya', amount: 50000, level: 'N5' },
]
const FIRST = ['Aarav','Diya','Vihaan','Ananya','Arjun','Saanvi','Karthik','Meena','Nikhil','Pooja','Varun','Sneha','Ravi','Divya','Ajay','Nisha','Vimal','Keerthi','Suriya','Lakshmi']
const LAST = ['Sharma','Patel','Reddy','Nair','Iyer','Krishnan','Subramanian','Venkat','Raman','Pillai']

let ec = 0
const email = n => { ec++; return `${n.toLowerCase().replace(/[^a-z]/g,'')}.col${ec}@demo.jlpt.test` }

console.log('Creating colleges…')
const colleges = []
for (const c of COLLEGES) {
  const { data, error } = await sb.from('colleges').insert({
    name: c.name, category: c.category, city: c.city,
    contact_person: c.contact_person, contact_phone: `+91 ${rand(70000,99999)} ${rand(10000,99999)}`,
    contact_email: `office@${c.name.split(' ')[0].toLowerCase()}.edu`,
    payment_type: 'Monthly', payment_amount: c.amount, join_code: genCode(),
    status: 'Active', notes: 'Demo college contract.',
  }).select().single()
  if (error) { console.error('  ✗', c.name, error.message); continue }
  colleges.push({ ...data, level: c.level })
  console.log(`  ✓ ${c.name} (join code ${data.join_code})`)
}

console.log('Creating college batches…')
for (const col of colleges) {
  const { data: batch, error } = await sb.from('batches').insert({
    name: `${col.name.split(' ')[0]} ${col.level} Batch`, jlpt_level: col.level,
    time_slot: '10:00 AM - 12:00 PM', days: 'Mon, Wed, Fri',
    capacity: 60, enrolled: 0, status: 'Active', start_date: isoDay(monthsAgo(rand(1,3))),
    mode: 'College', college_id: col.id,
  }).select().single()
  if (error) { console.error('  ✗ batch', col.name, error.message); continue }
  col.batch = batch

  // ~12 self-registered-style students per college (full accounts)
  const n = rand(10, 14)
  const rows = []
  for (let i = 0; i < n; i++) {
    const name = `${pick(FIRST)} ${pick(LAST)}`
    const { data: u, error: ue } = await sb.auth.admin.createUser({
      email: email(name.split(' ')[0]), password: PW, email_confirm: true,
      user_metadata: { full_name: name, role: 'student' },
    })
    if (ue) continue
    await sb.from('profiles').upsert({
      id: u.user.id, full_name: name, email: u.user.email, role: 'student',
      phone: `+91 ${rand(70000,99999)} ${rand(10000,99999)}`,
      jlpt_level: col.level, status: 'Active', college_id: col.id,
    })
    rows.push({ student_id: u.user.id, batch_id: batch.id, status: 'Active' })
  }
  if (rows.length) {
    await sb.from('student_batches').insert(rows)
    await sb.from('batches').update({ enrolled: rows.length }).eq('id', batch.id)
  }
  console.log(`  ✓ ${col.name}: ${rows.length} students enrolled into college batch`)

  // college payments — last 3 months
  for (let m = 2; m >= 0; m--) {
    const d = monthsAgo(m); d.setDate(7)
    await sb.from('college_payments').insert({
      college_id: col.id, batch_id: batch.id, amount: col.payment_amount || 40000,
      period_month: d.toISOString().slice(0, 7), payment_date: isoDay(d),
      payment_method: pick(['Bank Transfer','Cheque','UPI']),
      reference_number: `COL${Date.now().toString().slice(-6)}${rand(10,99)}`, status: 'Paid',
    })
  }
}

console.log('\n✅ College seed complete!  Demo password: ' + PW)
