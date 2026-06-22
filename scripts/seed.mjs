// One-time demo data seeder for the JLPT LMS.
// Run:  node scripts/seed.mjs
// Uses the service-role key from .env.local (bypasses RLS, creates auth users).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local ─────────────────────────────────────────────
const env = {}
for (const line of readFileSync(join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { console.error('Missing URL or SERVICE_ROLE_KEY in .env.local'); process.exit(1) }

const sb = createClient(URL, KEY, { auth: { autoRefreshToken: false, persistSession: false } })

// ── Helpers ─────────────────────────────────────────────────────
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const PW = 'Demo@1234'
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = (arr) => arr[rand(0, arr.length - 1)]
const isoDay = (d) => d.toISOString().slice(0, 10)
const monthsAgo = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d }

const FIRST = ['Aarav','Diya','Vihaan','Ananya','Arjun','Saanvi','Reyansh','Aadhya','Vivaan','Ishaan',
  'Kavya','Aditya','Myra','Sai','Anika','Krishna','Pari','Rohan','Navya','Dhruv',
  'Riya','Kabir','Tara','Yuki','Haruto','Sakura','Ren','Mei','Sora','Hina',
  'Kenji','Aoi','Rin','Daichi','Nao','Emma','Leo','Zara','Omar','Lina',
  'Farah','Yusuf','Maya','Karthik','Meena','Suresh','Divya','Nikhil','Pooja','Varun']
const LAST = ['Sharma','Patel','Reddy','Nair','Iyer','Gupta','Singh','Rao','Menon','Kapoor',
  'Tanaka','Sato','Suzuki','Watanabe','Yamamoto','Kobayashi','Das','Bose','Mehta','Joshi']
const TIME_SLOTS = ['7:00 AM - 9:00 AM', '10:00 AM - 12:00 PM', '4:00 PM - 6:00 PM', '6:30 PM - 8:30 PM', '5:00 PM - 7:00 PM']
const DAYS = ['Mon, Wed, Fri', 'Tue, Thu, Sat', 'Mon, Tue, Wed, Thu', 'Sat, Sun']
const BATCH_LABEL = { '7:00 AM - 9:00 AM': 'Morning', '10:00 AM - 12:00 PM': 'Morning', '4:00 PM - 6:00 PM': 'Evening', '6:30 PM - 8:30 PM': 'Evening', '5:00 PM - 7:00 PM': 'Evening' }
const FEE = { N5: 3000, N4: 3500, N3: 4000, N2: 4500, N1: 5000 }
const LESSON_TYPES = ['Video', 'Reading', 'Quiz', 'Practice', 'Audio']

let emailCounter = 0
function uniqEmail(name) {
  emailCounter++
  return `${name.toLowerCase().replace(/[^a-z]/g, '')}.${emailCounter}@demo.jlpt.test`
}

async function makeUser(fullName, role) {
  const email = uniqEmail(fullName.split(' ')[0])
  const { data, error } = await sb.auth.admin.createUser({
    email, password: PW, email_confirm: true,
    user_metadata: { full_name: fullName, role },
  })
  if (error) { console.error(`  ✗ ${email}: ${error.message}`); return null }
  return { id: data.user.id, email, full_name: fullName }
}

// ── 1. Teachers ─────────────────────────────────────────────────
console.log('Creating 5 teachers…')
const teachers = []
for (let i = 0; i < 5; i++) {
  const name = `${pick(FIRST)} ${pick(LAST)}`
  const u = await makeUser(name, 'teacher')
  if (!u) continue
  await sb.from('profiles').upsert({
    id: u.id, full_name: name, email: u.email, role: 'teacher',
    phone: `+91 ${rand(70000, 99999)} ${rand(10000, 99999)}`,
    status: 'Active', jlpt_level: LEVELS[i],
  })
  teachers.push({ ...u, level: LEVELS[i] })
}
console.log(`  ✓ ${teachers.length} teachers`)

// ── 2. Batches (one per level) ──────────────────────────────────
console.log('Creating batches…')
const batches = {}
for (let i = 0; i < LEVELS.length; i++) {
  const level = LEVELS[i]
  const teacher = teachers[i] || teachers[0]
  const slot = TIME_SLOTS[i]
  const { data, error } = await sb.from('batches').insert({
    name: `${level} ${BATCH_LABEL[slot] || 'Batch'} Batch`,
    jlpt_level: level, time_slot: slot, days: pick(DAYS),
    teacher_id: teacher?.id || null, teacher_name: teacher?.full_name || null,
    capacity: 15, enrolled: 0, status: 'Active',
    start_date: isoDay(monthsAgo(rand(2, 5))),
  }).select().single()
  if (error) { console.error(`  ✗ batch ${level}: ${error.message}`); continue }
  batches[level] = data
}
console.log(`  ✓ ${Object.keys(batches).length} batches`)

// ── 3. Students (10 per level) ──────────────────────────────────
console.log('Creating 50 students (10 per level)…')
const studentsByLevel = {}
for (const level of LEVELS) {
  studentsByLevel[level] = []
  const batch = batches[level]
  const slot = batch?.time_slot
  for (let i = 0; i < 10; i++) {
    const name = `${pick(FIRST)} ${pick(LAST)}`
    const u = await makeUser(name, 'student')
    if (!u) continue
    const createdAt = (() => { const d = monthsAgo(rand(0, 5)); d.setDate(rand(1, 28)); return d.toISOString() })()
    await sb.from('profiles').upsert({
      id: u.id, full_name: name, email: u.email, role: 'student',
      phone: `+91 ${rand(70000, 99999)} ${rand(10000, 99999)}`,
      jlpt_level: level, batch: BATCH_LABEL[slot] || 'Morning',
      status: pick(['Active', 'Active', 'Active', 'Trial', 'Completed']),
    })
    // backdate created_at so enrollment trend chart fills out
    await sb.from('profiles').update({ created_at: createdAt }).eq('id', u.id)
    studentsByLevel[level].push({ ...u, level })
  }
  console.log(`  ✓ ${level}: ${studentsByLevel[level].length}`)
}

// ── 4. Enroll students into their level's batch ─────────────────
console.log('Enrolling students into batches…')
let enrollCount = 0
for (const level of LEVELS) {
  const batch = batches[level]
  if (!batch) continue
  const rows = studentsByLevel[level].map(s => ({
    student_id: s.id, batch_id: batch.id, status: 'Active',
    enrolled_at: isoDay(monthsAgo(rand(0, 3))),
  }))
  if (rows.length) {
    const { error } = await sb.from('student_batches').insert(rows)
    if (error) console.error(`  ✗ enroll ${level}: ${error.message}`)
    else enrollCount += rows.length
    await sb.from('batches').update({ enrolled: rows.length }).eq('id', batch.id)
  }
}
console.log(`  ✓ ${enrollCount} enrollments`)

// ── 5. Courses + modules + lessons ──────────────────────────────
console.log('Creating courses, modules & lessons…')
let lessonTotal = 0
for (const level of LEVELS) {
  const { data: course, error } = await sb.from('courses').insert({
    title: `JLPT ${level} Complete Course`, jlpt_level: level,
    description: `Comprehensive ${level} preparation covering vocabulary, grammar, reading, and listening.`,
    duration_weeks: rand(10, 24), status: 'Active',
    enrolled_count: studentsByLevel[level].length,
  }).select().single()
  if (error) { console.error(`  ✗ course ${level}: ${error.message}`); continue }
  const modTitles = ['Vocabulary & Kanji', 'Grammar Foundations', 'Reading & Listening']
  for (let mi = 0; mi < modTitles.length; mi++) {
    const { data: mod } = await sb.from('course_modules').insert({
      course_id: course.id, title: modTitles[mi], order_index: mi + 1,
    }).select().single()
    if (!mod) continue
    const lessons = Array.from({ length: 3 }, (_, li) => ({
      module_id: mod.id, course_id: course.id,
      title: `${modTitles[mi]} — Lesson ${li + 1}`,
      lesson_type: pick(LESSON_TYPES),
      duration_minutes: rand(15, 60), order_index: li + 1,
      content_url: null,
    }))
    const { error: le } = await sb.from('lessons').insert(lessons)
    if (!le) lessonTotal += lessons.length
  }
}
console.log(`  ✓ 5 courses, 15 modules, ${lessonTotal} lessons`)

// ── 6. Attendance sessions + records ────────────────────────────
console.log('Creating attendance sessions & records…')
let sessTotal = 0, recTotal = 0
for (const level of LEVELS) {
  const batch = batches[level]
  if (!batch) continue
  const roster = studentsByLevel[level]
  if (!roster.length) continue
  const teacherId = batch.teacher_id
  for (let s = 0; s < 8; s++) {
    const date = isoDay(new Date(Date.now() - s * 3 * 86400000)) // every ~3 days back
    const records = roster.map(st => {
      const r = Math.random()
      const status = r < 0.82 ? 'Present' : r < 0.92 ? 'Late' : 'Absent'
      return { student_id: st.id, batch_id: batch.id, status }
    })
    const present = records.filter(r => r.status === 'Present').length
    const absent = records.filter(r => r.status === 'Absent').length
    const late = records.filter(r => r.status === 'Late').length
    const { data: session, error } = await sb.from('attendance_sessions').insert({
      batch_id: batch.id, session_date: date,
      topic: `${level} ${pick(['Grammar', 'Vocabulary', 'Reading', 'Kanji', 'Listening'])} practice`,
      total_present: present, total_absent: absent, total_late: late,
      created_by: teacherId,
    }).select().single()
    if (error) { continue }
    sessTotal++
    const recRows = records.map(r => ({ session_id: session.id, ...r }))
    const { error: re } = await sb.from('attendance_records').insert(recRows)
    if (!re) recTotal += recRows.length
  }
}
console.log(`  ✓ ${sessTotal} sessions, ${recTotal} records`)

// ── 7. Fee structures ───────────────────────────────────────────
console.log('Creating fee structures…')
const feeByLevel = {}
for (const level of LEVELS) {
  const { data, error } = await sb.from('fee_structures').insert({
    name: `${level} Monthly Tuition`, jlpt_level: level, amount: FEE[level],
    frequency: 'Monthly', description: `Standard monthly tuition for ${level} learners.`,
    is_active: true,
  }).select().single()
  if (!error) feeByLevel[level] = data
}
console.log(`  ✓ ${Object.keys(feeByLevel).length} fee structures`)

// ── 8. Invoices + payments (last 4 months) ──────────────────────
console.log('Creating invoices & payments…')
let invTotal = 0, payTotal = 0, revenue = 0
const METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card']
for (const level of LEVELS) {
  const batch = batches[level]
  const fee = feeByLevel[level]
  for (const st of studentsByLevel[level]) {
    for (let m = 3; m >= 0; m--) {
      const due = monthsAgo(m); due.setDate(5)
      // current month -> Pending, older -> mostly Paid, a few Overdue
      let status
      if (m === 0) status = pick(['Pending', 'Pending', 'Paid'])
      else status = Math.random() < 0.85 ? 'Paid' : 'Overdue'
      const { data: inv, error } = await sb.from('invoices').insert({
        student_id: st.id, batch_id: batch?.id || null,
        fee_structure_id: fee?.id || null, amount: FEE[level],
        due_date: isoDay(due), status,
        description: `${level} tuition — ${due.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
      }).select().single()
      if (error) continue
      invTotal++
      if (status === 'Paid') {
        const payDate = new Date(due); payDate.setDate(rand(1, 6))
        const { error: pe } = await sb.from('payments').insert({
          invoice_id: inv.id, student_id: st.id, amount: FEE[level],
          payment_method: pick(METHODS), payment_date: isoDay(payDate),
          reference_number: `PAY${Date.now().toString().slice(-6)}${rand(100, 999)}`,
          notes: null,
        })
        if (!pe) { payTotal++; revenue += FEE[level] }
      }
    }
  }
}
console.log(`  ✓ ${invTotal} invoices, ${payTotal} payments (₹${revenue.toLocaleString('en-IN')} collected)`)

console.log('\n✅ Seed complete!')
console.log(`   Demo login password for ALL seeded accounts: ${PW}`)
