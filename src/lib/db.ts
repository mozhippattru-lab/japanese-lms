import postgres from 'postgres'

// A single postgres.js connection pool, reused across hot-reloads in dev.
// Connects lazily on first query, so importing this at build time is safe even
// when DATABASE_URL is not yet set. Target: native Postgres on the same server
// (localhost), so SSL is off by default — set DATABASE_SSL=true to require it.
declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined
}

export const sql =
  global.__sql ??
  postgres(process.env.DATABASE_URL || 'postgres://localhost:5432/postgres', {
    max: 10,
    idle_timeout: 20,
    ssl: process.env.DATABASE_SSL === 'true' ? 'require' : false,
    // Return date/time columns as raw strings (not Date objects) to match the
    // supabase-js behaviour the app code was written against (e.g. `.slice(0,7)`,
    // `new Date(created_at)`). Serialize still accepts Date or string on insert.
    types: {
      date: {
        to: 1184,
        from: [1082, 1083, 1114, 1184], // date, time, timestamp, timestamptz
        serialize: (x: Date | string) => (x instanceof Date ? x.toISOString() : x),
        parse: (x: string) => x,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') global.__sql = sql
