#!/usr/bin/env bash
# Phase 2 — copy all data from Supabase cloud into the local Postgres.
# Run ON THE SERVER after setup_postgres.sh. Requires psql + pg_dump (installed
# with postgresql-client). This is a ONE-WAY, one-time migration.
#
# You need two connection strings:
#   SUPABASE_DB_URL : Supabase Dashboard → Project Settings → Database →
#                     "Connection string" → URI (session mode). Put in the DB password.
#   LOCAL_DB_URL    : the DATABASE_URL printed by setup_postgres.sh
#
# Usage:
#   export SUPABASE_DB_URL='postgres://postgres.dersmankgmytcftifuwm:PASS@aws-0-...pooler.supabase.com:5432/postgres'
#   export LOCAL_DB_URL='postgres://mozhi_app:PASS@localhost:5432/mozhippattru'
#   bash migrate_from_supabase.sh
set -euo pipefail
cd "$(dirname "$0")"

: "${SUPABASE_DB_URL:?set SUPABASE_DB_URL}"
: "${LOCAL_DB_URL:?set LOCAL_DB_URL}"

echo "── 1/5  Creating auth + session schema on local Postgres…"
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f 001_auth.sql

echo "── 2/5  Exporting auth.users (id, email, bcrypt hash) from Supabase…"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 \
  -c "\copy (SELECT id, email, encrypted_password, created_at FROM auth.users WHERE encrypted_password IS NOT NULL) TO 'auth_users.csv' WITH CSV"

echo "── 3/5  Importing users into local auth.users…"
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 \
  -c "\copy auth.users (id, email, encrypted_password, created_at) FROM 'auth_users.csv' WITH CSV"

echo "── 4/5  Dumping + restoring the app data (public schema)…"
# --no-owner/--no-privileges: don't carry Supabase roles/grants.
# RLS policies referencing auth.uid() restore fine thanks to the stub in 001.
pg_dump "$SUPABASE_DB_URL" \
  --schema=public --no-owner --no-privileges --no-comments \
  --disable-triggers -f public_dump.sql
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f public_dump.sql

echo "── 5/5  Applying app columns + roll-number helper…"
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f 002_app_columns.sql

echo
echo "✓ Migration complete. Sanity check:"
psql "$LOCAL_DB_URL" -c "SELECT count(*) AS users FROM auth.users;"
psql "$LOCAL_DB_URL" -c "SELECT count(*) AS profiles FROM profiles;"
echo "Delete the CSV/dump files when done: rm -f auth_users.csv public_dump.sql"
