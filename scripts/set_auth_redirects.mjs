// Allowlist the password-reset redirect URLs in Supabase Auth config.
// Reads SUPABASE_ACCESS_TOKEN + project ref from .env.local (same as run_migration).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = { ...process.env }
for (const line of readFileSync(join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim()
}
const PAT = env.SUPABASE_ACCESS_TOKEN
let ref = env.SUPABASE_PROJECT_REF || env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1]

const body = {
  site_url: 'https://mozhippattru.org',
  uri_allow_list: [
    'https://mozhippattru.org/**',
    'http://localhost:3000/**',
  ].join(','),
}

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
console.log('status', res.status)
const txt = await res.text()
console.log(txt.slice(0, 400))
