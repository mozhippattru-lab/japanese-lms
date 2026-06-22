import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Called right after a student self-registers with a college.
// Tags their profile to the college and auto-enrolls them into the
// college's active batch (inheriting its JLPT level).
export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { college_id } = await req.json()
  if (!college_id) return NextResponse.json({ error: 'Missing college_id' }, { status: 400 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'Server missing service key' }, { status: 500 })
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Verify the college exists & is active
  const { data: college } = await admin.from('colleges').select('id, name, status').eq('id', college_id).single()
  if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 })

  // Find the college's active batch (most recent)
  const { data: batch } = await admin
    .from('batches')
    .select('id, jlpt_level, enrolled, capacity')
    .eq('college_id', college_id)
    .eq('mode', 'College')
    .eq('status', 'Active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Tag the student to the college (+ inherit level from batch if available)
  const profileUpdate: Record<string, unknown> = { college_id, status: 'Active' }
  if (batch?.jlpt_level) profileUpdate.jlpt_level = batch.jlpt_level
  await admin.from('profiles').update(profileUpdate).eq('id', user.id)

  // Enroll into the college batch
  if (batch) {
    const { error: enrollErr } = await admin.from('student_batches').upsert(
      { student_id: user.id, batch_id: batch.id, status: 'Active' },
      { onConflict: 'student_id,batch_id' }
    )
    if (!enrollErr) {
      await admin.from('batches').update({ enrolled: (batch.enrolled || 0) + 1 }).eq('id', batch.id)
    }
  }

  return NextResponse.json({ ok: true, college: college.name, enrolled: !!batch })
}
