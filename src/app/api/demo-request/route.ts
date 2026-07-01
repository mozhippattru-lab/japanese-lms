import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Public endpoint — anyone on the marketing site can request a free demo class.
// Each request lands in the CRM (Admin → CRM/Leads) as a "New" lead, source "Website".

const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1', 'Package']

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const full_name = String(body.full_name || '').trim()
  const phone = String(body.phone || '').trim()
  const email = String(body.email || '').trim()
  const levelRaw = String(body.level || '').trim()
  const mode = String(body.mode || 'Online').trim()
  const preferred = String(body.preferred || '').trim()
  const message = String(body.message || '').trim()

  if (!full_name || !phone) {
    return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 })
  }
  if (full_name.length > 120 || phone.length > 30) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 })
  }

  // `leads.interested_level` only stores real JLPT levels; map the package option to N5.
  const interested_level = VALID_LEVELS.includes(levelRaw)
    ? (levelRaw === 'Package' ? 'N5' : levelRaw)
    : 'N5'

  const notes = [
    'Demo class request from website.',
    `Mode: ${mode}`,
    levelRaw ? `Interested in: ${levelRaw}` : null,
    preferred ? `Preferred timing: ${preferred}` : null,
    message ? `Message: ${message}` : null,
  ].filter(Boolean).join('\n')

  try {
    await sql`
      insert into leads (full_name, phone, email, source, interested_level, status, notes)
      values (${full_name}, ${phone}, ${email || null}, 'Website', ${interested_level}, 'New', ${notes})
    `
  } catch {
    return NextResponse.json({ error: 'Could not submit your request. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
