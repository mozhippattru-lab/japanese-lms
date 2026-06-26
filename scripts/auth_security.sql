-- ── Auth role security ────────────────────────────────────────────────
-- 1) New signups: role is decided by the DB, never by client metadata.
--    Only the two designated emails are admins; everyone else is a student.
--    (Teachers are promoted afterwards by the admin-only server API.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    CASE
      WHEN lower(NEW.email) IN ('iamsellaselva@gmail.com', 'japanese.school@mozhippattru.org')
        THEN 'admin'
      ELSE 'student'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- 2) A regular user may edit their own profile (name, phone, level…) but may
--    NOT change their own role or status. Only admins or the service role can.
CREATE OR REPLACE FUNCTION public.guard_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF (auth.jwt() ->> 'role') = 'service_role' OR public.get_my_role() = 'admin' THEN
    RETURN NEW;  -- privileged callers may change anything
  END IF;
  NEW.role   := OLD.role;     -- silently keep role/status for everyone else
  NEW.status := OLD.status;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_guard_profile_role ON public.profiles;
CREATE TRIGGER trg_guard_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_role();
