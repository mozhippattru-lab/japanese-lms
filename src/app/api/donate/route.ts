import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Public: capture a donation interest into the CRM (leads) so the team can
// follow up with payment details. Marked source='Donation'.
export async function POST(req: Request) {
  let b: Record<string, string> = {}
  try { b = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  const name = String(b.name || '').trim()
  const phone = String(b.mobile || '').trim()
  if (!name || !phone) return NextResponse.json({ error: 'Name and mobile are required' }, { status: 400 })

  const notes = [
    'DONATION interest (not a student lead).',
    `Amount: ₹${String(b.amount || '—')}`,
    b.place ? `Place: ${b.place}` : null,
  ].filter(Boolean).join('\n')

  try {
    await sql`
      insert into leads (full_name, phone, email, source, interested_level, status, notes)
      values (${name}, ${phone}, ${b.email || null}, 'Donation', 'N5', 'New', ${notes})
    `
  } catch {
    return NextResponse.json({ error: 'Could not submit. Please try again.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
