-- ONE-TIME pre-launch cleanup: remove all demo/seed data.
-- Keeps: app_settings (config) and all non-@demo.jlpt.test accounts.
-- All operational tables are seed-only, so they are emptied entirely.
-- Run via: node scripts/run_migration.mjs scripts/cleanup_demo.sql

BEGIN;

TRUNCATE
  public.payments,
  public.invoices,
  public.fee_structures,
  public.college_payments,
  public.attendance_records,
  public.attendance_sessions,
  public.assignment_submissions,
  public.assignments,
  public.lessons,
  public.course_modules,
  public.courses,
  public.student_batches,
  public.batches,
  public.colleges,
  public.leads,
  public.messages
  RESTART IDENTITY CASCADE;

-- Remove demo accounts (operational tables already cleared, so no FK blocks)
DELETE FROM public.profiles WHERE email LIKE '%@demo.jlpt.test';
DELETE FROM auth.users      WHERE email LIKE '%@demo.jlpt.test';

COMMIT;
