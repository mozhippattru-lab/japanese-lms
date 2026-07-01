import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// Called right after a student self-registers with a college.
// Tags their profile to the college and auto-enrolls them into the
// college's active batch (inheriting its JLPT level).
export async function POST(req: Request) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { college_id } = await req.json()
  if (!college_id) return NextResponse.json({ error: 'Missing college_id' }, { status: 400 })

  const [college] = await sql`select id, name, status from colleges where id = ${college_id} limit 1`
  if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 })

  // Find the college's active batch (most recent)
  const [batch] = await sql`
    select id, jlpt_level, enrolled, capacity from batches
    where college_id = ${college_id} and mode = 'College' and status = 'Active'
    order by created_at desc limit 1
  `

  // Tag the student to the college (+ inherit level from batch if available)
  if (batch?.jlpt_level) {
    await sql`update profiles set college_id = ${college_id}, status = 'Active', jlpt_level = ${batch.jlpt_level} where id = ${me.id}`
  } else {
    await sql`update profiles set college_id = ${college_id}, status = 'Active' where id = ${me.id}`
  }

  // Enroll into the college batch
  if (batch) {
    await sql`
      insert into student_batches (student_id, batch_id, status)
      values (${me.id}, ${batch.id}, 'Active')
      on conflict (student_id, batch_id) do update set status = 'Active'
    `
    await sql`update batches set enrolled = ${(batch.enrolled || 0) + 1} where id = ${batch.id}`
  }

  return NextResponse.json({ ok: true, college: college.name, enrolled: !!batch })
}
