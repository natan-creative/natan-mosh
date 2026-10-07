-- =========================================================
-- Natan Kosovsky — Supabase schema
-- להריץ פעם אחת: Supabase → SQL Editor → New query → להדביק → Run
-- בטוח להריץ שוב (לא מוחק נתונים).
-- =========================================================

-- ---------- מי מורשה לערוך ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "admins see themselves" on public.admins;
create policy "admins see themselves" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- ---------- התוכן: טיוטה ומפורסם ----------
create table if not exists public.site_content (
  id text primary key check (id in ('draft', 'published')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

-- כולם יכולים לקרוא רק את המפורסם. את הטיוטה רואים ועורכים רק admins.
drop policy if exists "public reads published" on public.site_content;
create policy "public reads published" on public.site_content
  for select to anon, authenticated using (id = 'published');

drop policy if exists "admins read all content" on public.site_content;
create policy "admins read all content" on public.site_content
  for select to authenticated using (public.is_admin());

drop policy if exists "admins write content" on public.site_content;
create policy "admins write content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- היסטוריית גרסאות ----------
create table if not exists public.revisions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('publish', 'draft', 'restore')),
  label text not null default '',
  data jsonb not null
);
alter table public.revisions enable row level security;

drop policy if exists "admins manage revisions" on public.revisions;
create policy "admins manage revisions" on public.revisions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- ספריית מדיה ----------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  kind text not null check (kind in ('image', 'video')),
  name text not null default '',
  mime text not null,
  size bigint not null default 0,
  width int,
  height int,
  alt text not null default '',
  caption text not null default '',
  created_at timestamptz not null default now()
);
alter table public.media enable row level security;

drop policy if exists "admins manage media" on public.media;
create policy "admins manage media" on public.media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage: הקבצים עצמם ----------
-- bucket ציבורי לקריאה (האתר מציג את התמונות), כתיבה רק ל-admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800,
        array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------- טופס יצירת קשר ----------
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 5000)
);
alter table public.contact_messages enable row level security;

-- מבקרים יכולים רק לשלוח. לקרוא: בדשבורד של Supabase, או admins.
drop policy if exists "anyone can send a message" on public.contact_messages;
create policy "anyone can send a message" on public.contact_messages
  for insert to anon with check (true);

drop policy if exists "admins read messages" on public.contact_messages;
create policy "admins read messages" on public.contact_messages
  for select to authenticated using (public.is_admin());

-- =========================================================
-- אחרי שיצרתם משתמש (Authentication → Users → Add user),
-- הופכים אותו לעורך. להחליף את המייל ולהריץ:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'natan@example.com'
--   on conflict do nothing;
-- =========================================================
