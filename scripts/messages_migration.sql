-- Direct messaging between users (student ↔ teacher ↔ admin)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_messages_recipient on public.messages(recipient_id);
create index if not exists idx_messages_created on public.messages(created_at);

alter table public.messages enable row level security;

-- A user can read any message they sent or received
drop policy if exists messages_select_own on public.messages;
create policy messages_select_own on public.messages
  for select using (sender_id = auth.uid() or recipient_id = auth.uid());

-- A user can only send as themselves
drop policy if exists messages_insert_own on public.messages;
create policy messages_insert_own on public.messages
  for insert with check (sender_id = auth.uid());

-- The recipient may mark a message read
drop policy if exists messages_update_read on public.messages;
create policy messages_update_read on public.messages
  for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- Admins have full access
drop policy if exists messages_admin_all on public.messages;
create policy messages_admin_all on public.messages
  for all using (public.get_my_role() = 'admin') with check (public.get_my_role() = 'admin');
