// Apply a .sql file to Supabase via the Management API.
// Reads credentials from .env.local (never hardcode secrets here — this file is committed).
//   SUPABASE_ACCESS_TOKEN=sbp_...        (Supabase Personal Access Token)
//   SUPABASE_PROJECT_REF=xxxxxxxx        (project ref; falls back to parsing NEXT_PUBLIC_SUPABASE_URL)
// Usage:  node scripts/run_migration.mjs scripts/some_migration.sql
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = { ...process.env }
try {
  for (const line of readFileSync(join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim()
  }
} catch {}

const PAT = env.SUPABASE_ACCESS_TOKEN
let ref = env.SUPABASE_PROJECT_REF
if (!ref && env.NEXT_PUBLIC_SUPABASE_URL) {
  ref = env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1]
}

const file = process.argv[2]
if (!file) { console.error('usage: node run_migration.mjs <file.sql>'); process.exit(1) }
if (!PAT) { console.error('Missing SUPABASE_ACCESS_TOKEN in .env.local'); process.exit(1) }
if (!ref) { console.error('Missing SUPABASE_PROJECT_REF (or NEXT_PUBLIC_SUPABASE_URL) in .env.local'); process.exit(1) }

const query = readFileSync(file, 'utf8')
const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})
console.log('status', res.status)
console.log(await res.text())
