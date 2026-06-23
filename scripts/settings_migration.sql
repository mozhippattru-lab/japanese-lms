-- Single-row institute settings
create table if not exists public.app_settings (
  id text primary key default 'default',
  institute_name_ta text default 'மொழிப்பற்று',
  institute_name_en text default 'Mozhippattru',
  tagline text default 'Japanese Language Center',
  address text,
  phone text,
  email text,
  registration_no text,
  working_start text default '09:00 AM',
  working_end text default '07:00 PM',
  currency text default '₹',
  academic_year text,
  updated_at timestamptz default now()
);

insert into public.app_settings (id) values ('default') on conflict (id) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists app_settings_read on public.app_settings;
create policy app_settings_read on public.app_settings
  for select using (true);

drop policy if exists app_settings_admin on public.app_settings;
create policy app_settings_admin on public.app_settings
  for all using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');
