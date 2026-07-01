# Database migration — Supabase → self-hosted Postgres

One-time move of the JLPT LMS off Supabase cloud onto native PostgreSQL on the
Contabo server. Run these **on the server** (they need `psql`/`pg_dump` and the
Supabase DB password).

## Order

1. **`setup_postgres.sh`** — installs PostgreSQL, creates the `mozhippattru` DB
   and `mozhi_app` role, and prints the `DATABASE_URL` + `SESSION_SECRET` to add
   to `/var/www/japanese-lms/.env`.
   ```bash
   sudo bash setup_postgres.sh
   ```

2. **`migrate_from_supabase.sh`** — copies all data across. Needs both DB URLs:
   ```bash
   export SUPABASE_DB_URL='...from Supabase dashboard → Database → Connection string (URI)...'
   export LOCAL_DB_URL='postgres://mozhi_app:PASS@localhost:5432/mozhippattru'
   bash migrate_from_supabase.sh
   ```

3. Put `DATABASE_URL` + `SESSION_SECRET` in `.env`, then redeploy (the app code
   switches to Postgres in later phases).

## Files

- `001_auth.sql` — `auth.users` (identity, migrated bcrypt hashes), `sessions`,
  `password_reset_tokens`, plus `auth.uid()`/`auth.role()` stubs so any RLS
  policies in the dump restore cleanly. Kept the identity table named
  `auth.users` so the app tables' foreign keys need no rewriting.
- `002_app_columns.sql` — enrollment columns (`roll_number`, `aadhar_number`,
  `address`, `photo_url`), the `generate_roll_number()` helper, and the settings
  access-control/notification/finance columns. (These previously landed on the
  wrong Supabase project, so they must be applied here.)
- `migrate_from_supabase.sh` — orchestrates the whole copy.

## Notes / gotchas

- **Passwords are preserved** — bcrypt hashes come across verbatim, so everyone
  logs in exactly as before.
- If `pg_dump` errors on a Supabase-specific extension (e.g. `pg_graphql`,
  `pgjwt`, `vault`, `pg_net`), those live in non-`public` schemas and are not
  dumped; if a `public` object references one, tell me the error and I'll add a
  targeted strip/stub. The migration is designed to be re-runnable after such a
  fix (drop + recreate the DB, or `TRUNCATE`).
- After a successful cutover, delete `auth_users.csv` and `public_dump.sql`.
