-- 1. Colleges
create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  city text,
  contact_person text,
  contact_phone text,
  contact_email text,
  payment_type text default 'Monthly',
  payment_amount numeric default 0,
  join_code text unique,
  status text default 'Active',
  notes text,
  created_at timestamptz default now()
);

-- 2. Batch mode + college link
alter table public.batches add column if not exists mode text default 'Office';
alter table public.batches add column if not exists college_id uuid references public.colleges(id) on delete set null;
update public.batches set mode = 'Office' where mode is null;

-- 3. Tag students to a college
alter table public.profiles add column if not exists college_id uuid references public.colleges(id) on delete set null;

-- 4. College payments (second revenue stream)
create table if not exists public.college_payments (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references public.colleges(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  amount numeric not null default 0,
  period_month text,
  payment_date date,
  payment_method text,
  reference_number text,
  status text default 'Paid',
  notes text,
  created_at timestamptz default now()
);

-- 5. RLS
alter table public.colleges enable row level security;
alter table public.college_payments enable row level security;

drop policy if exists "colleges_admin_all" on public.colleges;
create policy "colleges_admin_all" on public.colleges for all using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');
drop policy if exists "colleges_read_all" on public.colleges;
create policy "colleges_read_all" on public.colleges for select using (true);

drop policy if exists "college_payments_admin_all" on public.college_payments;
create policy "college_payments_admin_all" on public.college_payments for all using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');
