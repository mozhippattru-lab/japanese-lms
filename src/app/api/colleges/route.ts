import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Public: list active colleges for the registration dropdown.
export async function GET() {
  const colleges = await sql`select id, name, join_code from colleges where status = 'Active' order by name`
  return NextResponse.json({ colleges })
}
