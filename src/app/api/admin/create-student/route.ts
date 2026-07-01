import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const body = await req.json()
  const { full_name, email, phone, password, jlpt_level, batch, status, college_id, aadhar_number, address, photo_url } = body
  if (!full_name || !email || !password) return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  if (String(password).length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'Server is missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Create auth user
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { full_name, role: 'student' },
  })
  if (createErr || !created.user) return NextResponse.json({ error: createErr?.message || 'Failed to create user' }, { status: 400 })

  // Auto-generate roll number (e.g. MGL0301). Prefer the DB function; if it
  // isn't available (e.g. schema cache not reloaded), fall back to computing
  // the next number from the highest existing MGL roll number.
  let roll_number = ''
  const { data: rollData, error: rollErr } = await admin.rpc('generate_roll_number')
  if (!rollErr && typeof rollData === 'string' && rollData) {
    roll_number = rollData
  } else {
    const { data: last } = await admin
      .from('profiles')
      .select('roll_number')
      .like('roll_number', 'MGL%')
      .order('roll_number', { ascending: false })
      .limit(1)
      .maybeSingle()
    let next = 301
    if (last?.roll_number) {
      const n = parseInt(String(last.roll_number).replace(/\D/g, ''), 10)
      if (!Number.isNaN(n)) next = n + 1
    }
    roll_number = `MGL${String(next).padStart(4, '0')}`
  }

  // Upsert profile
  const profile = {
    id: created.user.id,
    full_name, email,
    phone: phone || null,
    role: 'student',
    jlpt_level: jlpt_level || null,
    batch: batch || null,
    status: status || 'Active',
    college_id: college_id || null,
    roll_number,
    aadhar_number: aadhar_number || null,
    address: address || null,
    photo_url: photo_url || null,
  }
  const { error: profileErr } = await admin.from('profiles').upsert(profile)
  if (profileErr) {
    await admin.auth.admin.deleteUser(created.user.id)
    return NextResponse.json({ error: profileErr.message }, { status: 400 })
  }

  return NextResponse.json({ student: { ...profile, created_at: created.user.created_at } })
}
