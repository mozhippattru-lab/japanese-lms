#!/usr/bin/env bash
# Phase 1 — provision native PostgreSQL on the Contabo (Ubuntu) server.
# Run as root (or with sudo) ON THE SERVER. Idempotent-ish; safe to re-read.
set -euo pipefail

DB_NAME="${DB_NAME:-mozhippattru}"
DB_USER="${DB_USER:-mozhi_app}"
# Generate a strong password once and save it; reuse if already set.
DB_PASS="${DB_PASS:-$(openssl rand -hex 24)}"

echo "── Installing PostgreSQL…"
apt-get update
apt-get install -y postgresql postgresql-contrib

echo "── Creating role + database…"
sudo -u postgres psql <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  END IF;
END \$\$;
SQL

# Create DB if missing (owned by the app role)
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" \
  | grep -q 1 || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

echo
echo "════════════════════════════════════════════════════════════════"
echo " Database ready."
echo "   DB_NAME = ${DB_NAME}"
echo "   DB_USER = ${DB_USER}"
echo "   DB_PASS = ${DB_PASS}"
echo
echo " Add this to /var/www/japanese-lms/.env (localhost, no SSL):"
echo "   DATABASE_URL=postgres://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
echo "   SESSION_SECRET=$(openssl rand -hex 32)"
echo "════════════════════════════════════════════════════════════════"
echo " Save DB_PASS now — it is not stored anywhere else."
