#!/usr/bin/env bash
# One-shot server-side migration, run via GitHub Actions over SSH (as root).
# Installs Postgres, provisions the DB, writes .env, and copies all data from
# Supabase. Idempotent: safe to re-run (skips data import if already migrated,
# unless FORCE=1). Requires env: SUPABASE_DB_URL. Optional: FORCE=1.
set -euo pipefail

APP_DIR="/var/www/japanese-lms"
ENV_FILE="${APP_DIR}/.env"
DB_NAME="${DB_NAME:-mozhippattru}"
DB_USER="${DB_USER:-mozhi_app}"
cd "$APP_DIR"

: "${SUPABASE_DB_URL:?SUPABASE_DB_URL not set (add it as a GitHub secret)}"

echo "== 1/6  Ensuring PostgreSQL is installed =="
if ! command -v psql >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq postgresql postgresql-contrib >/dev/null
fi
(systemctl enable --now postgresql 2>/dev/null || service postgresql start || true)

# Supabase runs Postgres 17; Ubuntu's default pg_dump is 16 and refuses to dump
# a newer server. Ensure a v17+ client from the official PostgreSQL (PGDG) repo.
PG_DUMP="$(command -v pg_dump || true)"
if [ -z "$PG_DUMP" ] || ! "$PG_DUMP" --version | grep -qE ' (1[7-9]|[2-9][0-9])'; then
  echo "   Installing PostgreSQL 17 client from PGDG…"
  export DEBIAN_FRONTEND=noninteractive
  apt-get install -y -qq curl ca-certificates gnupg lsb-release >/dev/null
  install -d /usr/share/postgresql-common/pgdg
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
  echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list
  apt-get update -qq
  apt-get install -y -qq postgresql-client-17 >/dev/null
  PG_DUMP="/usr/lib/postgresql/17/bin/pg_dump"
fi
echo "   Using pg_dump: $($PG_DUMP --version)"

echo "== 2/6  Ensuring role + database =="
# Reuse an existing password from .env if present, else generate a new one.
if grep -q '^DATABASE_URL=' "$ENV_FILE" 2>/dev/null; then
  DB_PASS="$(grep '^DATABASE_URL=' "$ENV_FILE" | head -1 | sed -E 's#.*://[^:]+:([^@]+)@.*#\1#')"
else
  DB_PASS="$(openssl rand -hex 24)"
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  ELSE
    ALTER ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  END IF;
END \$\$;
SQL
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

LOCAL_DB_URL="postgres://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"

echo "== 2b   Ensuring Supabase stub roles (superuser) =="
# Roles are cluster-global; the dumped RLS policies reference them `TO ...`.
sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='anon')          THEN CREATE ROLE anon NOLOGIN;          END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='service_role')  THEN CREATE ROLE service_role NOLOGIN;  END IF;
END $$;
SQL

echo "== 3/6  Writing .env (DATABASE_URL, SESSION_SECRET) =="
touch "$ENV_FILE"
grep -q '^DATABASE_URL='   "$ENV_FILE" || echo "DATABASE_URL=${LOCAL_DB_URL}"        >> "$ENV_FILE"
grep -q '^SESSION_SECRET=' "$ENV_FILE" || echo "SESSION_SECRET=$(openssl rand -hex 32)" >> "$ENV_FILE"

# Optional full reset (only before cutover — wipes the target app DB).
if [ "${FORCE:-0}" = "1" ]; then
  echo "   FORCE=1 → resetting target schemas"
  psql "$LOCAL_DB_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; DROP SCHEMA IF EXISTS auth CASCADE;"
fi

echo "== 4/6  Auth schema (001) =="
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f db/001_auth.sql

ALREADY="$(psql "$LOCAL_DB_URL" -tAc "SELECT to_regclass('public.profiles') IS NOT NULL" 2>/dev/null || echo f)"
if [ "$ALREADY" = "t" ]; then
  echo "== 5/6  profiles already present — skipping data import (set FORCE=1 to redo) =="
else
  echo "== 5/6  Importing users + app data from Supabase =="
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
    -c "\copy (SELECT id,email,encrypted_password,created_at FROM auth.users WHERE encrypted_password IS NOT NULL) TO '/tmp/auth_users.csv' WITH CSV"
  psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 <<SQL
CREATE TEMP TABLE _u(id uuid, email text, encrypted_password text, created_at timestamptz);
\copy _u FROM '/tmp/auth_users.csv' WITH CSV
INSERT INTO auth.users(id,email,encrypted_password,created_at)
SELECT id,email,encrypted_password,created_at FROM _u
ON CONFLICT (id) DO NOTHING;
SQL
  "$PG_DUMP" "$SUPABASE_DB_URL" --schema=public --no-owner --no-privileges --no-comments -f /tmp/public_dump.sql
  # Normalize the dump for a plain PG16 target:
  #  - drop PG17-only session GUCs the local server doesn't recognize
  #  - drop "CREATE SCHEMA public" (we recreate it ourselves below)
  sed -i -E '/^SET (transaction_timeout|idle_session_timeout)/d; /^CREATE SCHEMA public;/d' /tmp/public_dump.sql
  # Start from a clean public schema so re-runs never trip on leftovers.
  # (auth schema + migrated users live in the `auth` schema and are untouched.)
  psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
  psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f /tmp/public_dump.sql
  echo "== 6/6  Session tables + app columns + roll-number helper =="
  # Recreate our public.sessions / password_reset_tokens (dropped with public above).
  psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f db/001_auth.sql
  psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f db/002_app_columns.sql
  rm -f /tmp/auth_users.csv /tmp/public_dump.sql
fi

echo "── Sanity check ──"
psql "$LOCAL_DB_URL" -c "SELECT count(*) AS auth_users FROM auth.users;"
psql "$LOCAL_DB_URL" -c "SELECT count(*) AS profiles FROM profiles;"
echo "✓ Migration finished. .env updated with DATABASE_URL + SESSION_SECRET."
