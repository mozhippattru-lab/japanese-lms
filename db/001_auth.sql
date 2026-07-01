-- ─────────────────────────────────────────────────────────────────────────
-- Auth objects for the self-hosted stack (replaces Supabase GoTrue).
-- We keep the identity table as `auth.users` so the restored app tables' many
-- foreign keys (profiles.id -> auth.users(id), etc.) resolve with no surgery.
-- It is just a plain table now — no GoTrue, no Supabase.
-- Run this BEFORE restoring the app-data dump (the dump's FKs need it to exist).
-- Idempotent.
-- ─────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS auth;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- some Supabase defaults use this

-- Note: the Supabase stub roles (anon / authenticated / service_role) that the
-- dumped RLS policies reference are created by ci_migrate.sh as the postgres
-- superuser (creating roles needs CREATEROLE, which the app role lacks).

-- Stub the Supabase helpers so any RLS policies carried in the dump restore
-- cleanly (they simply never match; the app connects as table owner and
-- bypasses RLS anyway).
CREATE OR REPLACE FUNCTION auth.uid()  RETURNS uuid  LANGUAGE sql STABLE AS $$ SELECT NULL::uuid  $$;
CREATE OR REPLACE FUNCTION auth.role() RETURNS text  LANGUAGE sql STABLE AS $$ SELECT NULL::text  $$;
CREATE OR REPLACE FUNCTION auth.jwt()  RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT '{}'::jsonb $$;

-- Identity table. Migrated 1:1 from Supabase auth.users; encrypted_password
-- holds the original bcrypt ($2a$…) hash so existing passwords keep working.
CREATE TABLE IF NOT EXISTS auth.users (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              text UNIQUE NOT NULL,
  encrypted_password text NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- Opaque server-side sessions (httpOnly cookie holds the token).
CREATE TABLE IF NOT EXISTS public.sessions (
  token      text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON public.sessions(expires_at);

-- One-time password-reset tokens (emailed link).
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  token      text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  used       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS prt_user_id_idx ON public.password_reset_tokens(user_id);
