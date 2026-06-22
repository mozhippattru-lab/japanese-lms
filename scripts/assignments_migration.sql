-- Assignments + Grading feature
-- Run via Supabase Management API

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  instructions text,
  batch_id uuid references public.batches(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  jlpt_level text,
  type text not null default 'Assignment',          -- 'Assignment' | 'Test'
  max_points integer not null default 100,
  due_date date,
  status text not null default 'Published',          -- 'Draft' | 'Published' | 'Closed'
  created_at timestamptz default now()
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  content text,
  attachment_url text,
  status text not null default 'Submitted',          -- 'Submitted' | 'Graded' | 'Returned'
  points integer,
  feedback text,
  submitted_at timestamptz default now(),
  graded_at timestamptz,
  graded_by uuid references public.profiles(id) on delete set null,
  unique(assignment_id, student_id)
);

create index if not exists idx_assignments_batch on public.assignments(batch_id);
create index if not exists idx_assignments_teacher on public.assignments(teacher_id);
create index if not exists idx_subs_assignment on public.assignment_submissions(assignment_id);
create index if not exists idx_subs_student on public.assignment_submissions(student_id);

alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;

-- ── assignments policies ──────────────────────────────────────────────
drop policy if exists assignments_admin_all on public.assignments;
create policy assignments_admin_all on public.assignments
  for all using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');

drop policy if exists assignments_teacher_all on public.assignments;
create policy assignments_teacher_all on public.assignments
  for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

drop policy if exists assignments_student_read on public.assignments;
create policy assignments_student_read on public.assignments
  for select using (
    status = 'Published' and exists (
      select 1 from public.student_batches sb
      where sb.batch_id = assignments.batch_id and sb.student_id = auth.uid()
    )
  );

-- ── submissions policies ──────────────────────────────────────────────
drop policy if exists subs_admin_all on public.assignment_submissions;
create policy subs_admin_all on public.assignment_submissions
  for all using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');

drop policy if exists subs_student_own on public.assignment_submissions;
create policy subs_student_own on public.assignment_submissions
  for all using (student_id = auth.uid()) with check (student_id = auth.uid());

drop policy if exists subs_teacher_read on public.assignment_submissions;
create policy subs_teacher_read on public.assignment_submissions
  for select using (
    exists (select 1 from public.assignments a
            where a.id = assignment_submissions.assignment_id and a.teacher_id = auth.uid())
  );

drop policy if exists subs_teacher_grade on public.assignment_submissions;
create policy subs_teacher_grade on public.assignment_submissions
  for update using (
    exists (select 1 from public.assignments a
            where a.id = assignment_submissions.assignment_id and a.teacher_id = auth.uid())
  ) with check (true);
