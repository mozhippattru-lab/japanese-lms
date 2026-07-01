-- ─────────────────────────────────────────────────────────────────────────
-- App columns + helpers that were previously applied to the WRONG Supabase
-- project (oglfnbquqkesqxbryvmr). Run this AFTER restoring the app data so the
-- profiles / app_settings tables exist. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────

-- Student enrollment fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS roll_number   text UNIQUE,
  ADD COLUMN IF NOT EXISTS aadhar_number text,
  ADD COLUMN IF NOT EXISTS address       text,
  ADD COLUMN IF NOT EXISTS photo_url     text;

-- Roll-number generator: MGL0301, MGL0302, …
CREATE SEQUENCE IF NOT EXISTS student_roll_seq START 301;

CREATE OR REPLACE FUNCTION generate_roll_number()
RETURNS text LANGUAGE plpgsql AS $$
DECLARE next_val bigint;
BEGIN
  SELECT nextval('student_roll_seq') INTO next_val;
  RETURN 'MGL' || LPAD(next_val::text, 4, '0');
END; $$;

-- Settings: access control + notifications + finance
ALTER TABLE app_settings
  ADD COLUMN IF NOT EXISTS student_login_blocked  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS teacher_login_blocked  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS new_registrations_open boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS maintenance_mode       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_notifications boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_notifications    boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS fee_reminders_enabled  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fee_reminder_days      int     NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS late_fee_pct           numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS blocked_message        text;

-- Note: we keep the identity table as auth.users, so profiles' existing FK
-- (profiles.id -> auth.users(id)) stays valid — no re-pointing needed.
