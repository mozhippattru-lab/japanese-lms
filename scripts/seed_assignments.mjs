// Demo seeder for the Assignments + Grading feature.
// Run:  node scripts/seed_assignments.mjs
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
const daysFromNow = n => { const d = new Date(); d.setDate(d.getDate() + n); return d }

const TITLES_BY_LEVEL = {
  N5: ['Hiragana Writing Practice', 'Basic Kanji Set 1', 'Self-introduction Essay', 'Numbers & Counters Worksheet'],
  N4: ['Te-form Conjugation Drill', 'Kanji Set 5 Reading', 'Daily Routine Composition', 'Particle Usage Quiz'],
  N3: ['Keigo Practice', 'Intermediate Reading Comprehension', 'Conditional Forms Worksheet', 'Newspaper Summary'],
  N2: ['Advanced Grammar Patterns', 'Business Japanese Email', 'Reading: Editorial Analysis', 'Vocabulary Set 12'],
  N1: ['Nuance & Idioms Essay', 'Academic Reading Response', 'Advanced Kanji Compounds', 'Formal Speech Draft'],
}
const FEEDBACK = [
  'Good effort. Watch your stroke order on a few kanji.',
  'Well done — clear and accurate. Keep it up!',
  'Solid work. Review the particle usage in section 2.',
  'Nice progress. Try to expand your sentences a little more.',
  'Almost there — small grammar slips, but good comprehension.',
]
const ANSWERS = [
  'はじめまして。わたしは がくせいです。どうぞ よろしく おねがいします。',
  'I have completed all the exercises and reviewed the example sentences.',
  'Please find my full answer attached in the text below. I focused on the grammar points covered in class.',
  'きょうは いい てんきです。わたしは こうえんへ いきました。',
]

console.log('Loading batches with teachers + enrolled students…')
const { data: batches } = await sb
  .from('batches')
  .select('id, name, jlpt_level, teacher_id')
  .not('teacher_id', 'is', null)

let aCount = 0, sCount = 0, gCount = 0

for (const b of batches || []) {
  const level = b.jlpt_level || 'N5'
  const titles = TITLES_BY_LEVEL[level] || TITLES_BY_LEVEL.N5

  // enrolled students for this batch
  const { data: enr } = await sb.from('student_batches').select('student_id').eq('batch_id', b.id)
  const studentIds = (enr || []).map(e => e.student_id)
  if (studentIds.length === 0) continue

  // 3 assignments + 1 test per batch
  const specs = [
    { type: 'Assignment', title: titles[0], due: daysFromNow(-10), max: 100 },
    { type: 'Assignment', title: titles[1], due: daysFromNow(-3), max: 50 },
    { type: 'Assignment', title: titles[2], due: daysFromNow(7), max: 100 },
    { type: 'Test', title: `${level} Mock Test 1`, due: daysFromNow(-5), max: 180 },
  ]

  for (const spec of specs) {
    const { data: a, error } = await sb.from('assignments').insert({
      title: spec.title,
      description: `${spec.type} for ${b.name}`,
      instructions: `Complete this ${spec.type.toLowerCase()} and submit your answer. Max ${spec.max} points.`,
      batch_id: b.id, teacher_id: b.teacher_id, jlpt_level: level,
      type: spec.type, max_points: spec.max, due_date: isoDay(spec.due), status: 'Published',
    }).select().single()
    if (error) { console.error(error.message); continue }
    aCount++

    // past-due items get submissions from ~70% of students; future ones from ~30%
    const isPast = spec.due < new Date()
    for (const sid of studentIds) {
      const submits = Math.random() < (isPast ? 0.75 : 0.3)
      if (!submits) continue
      const graded = isPast && Math.random() < 0.7
      const pts = graded ? rand(Math.floor(spec.max * 0.45), spec.max) : null
      const { error: se } = await sb.from('assignment_submissions').insert({
        assignment_id: a.id, student_id: sid,
        content: pick(ANSWERS),
        status: graded ? 'Graded' : 'Submitted',
        points: pts,
        feedback: graded ? pick(FEEDBACK) : null,
        submitted_at: new Date(spec.due.getTime() - rand(1, 3) * 86400000).toISOString(),
        graded_at: graded ? new Date(spec.due.getTime() + 86400000).toISOString() : null,
        graded_by: graded ? b.teacher_id : null,
      })
      if (se) { if (!se.message.includes('duplicate')) console.error(se.message); continue }
      sCount++
      if (graded) gCount++
    }
  }
}

console.log(`Done. Created ${aCount} assignments/tests, ${sCount} submissions (${gCount} graded).`)
