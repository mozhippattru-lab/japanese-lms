import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  // 1. Verify the caller is a logged-in admin
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  // 2. Parse + validate input
  const body = await req.json()
  const { full_name, email, phone, password, jlpt_level, status } = body
  if (!full_name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  // 3. Create the auth user via the Admin API (does NOT touch the admin's session)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'Server is missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
  }
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // teacher can log in immediately
    user_metadata: { full_name, role: 'teacher' },
  })
  if (createErr || !created.user) {
    return NextResponse.json({ error: createErr?.message || 'Failed to create user' }, { status: 400 })
  }

  // 4. Upsert the profile as a teacher. The signup trigger created a 'student'
  //    row; the service role here is allowed to set role='teacher'.
  const profile = {
    id: created.user.id,
    full_name, email, phone: phone || null,
    role: 'teacher', jlpt_level: jlpt_level || null,
    status: status || 'Active',
  }
  const { error: profileErr } = await admin.from('profiles').upsert(profile)
  if (profileErr) {
    await admin.auth.admin.deleteUser(created.user.id) // avoid orphan auth user
    return NextResponse.json({ error: profileErr.message }, { status: 400 })
  }

  return NextResponse.json({
    teacher: { ...profile, created_at: created.user.created_at },
  })
}
