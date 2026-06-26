-- Remove the 6 dummy/test signups (fake @gmail addresses), explicitly listed.
-- profiles is already empty, so this only clears these auth.users rows.
DELETE FROM auth.users
WHERE email IN (
  'mozhilppattru@gmail.com',
  'arul@gmail.com',
  'saravanan@gmail.com',
  'sella@gmail.com',
  'rupa@gmail.com',
  'durai@gmail.com'
);
