-- להריץ פעם אחת ב-Supabase: SQL Editor -> New query -> Run

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 5000)
);

alter table public.contact_messages enable row level security;

-- מבקרים באתר יכולים רק לשלוח הודעה. לא לקרוא, לא לערוך, לא למחוק.
-- את ההודעות רואים בדשבורד: Table Editor -> contact_messages
drop policy if exists "anyone can send a message" on public.contact_messages;
create policy "anyone can send a message"
  on public.contact_messages for insert
  to anon
  with check (true);
