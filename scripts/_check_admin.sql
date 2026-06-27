-- Targeted: the non-demo accounts and whether each still has a profile row.
-- Needed to ensure the admin can still access the dashboard after cleanup.
SELECT
  u.email,
  u.raw_user_meta_data->>'role'      AS meta_role,
  u.raw_user_meta_data->>'full_name' AS meta_name,
  (p.id IS NOT NULL)                 AS has_profile,
  p.role                             AS profile_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email NOT LIKE '%@demo.jlpt.test'
ORDER BY u.created_at;
