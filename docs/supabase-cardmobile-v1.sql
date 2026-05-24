create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_collections (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id integer not null,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.profiles enable row level security;
alter table public.player_collections enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_upsert_own"
on public.profiles
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "collections_select_own"
on public.player_collections
for select
to authenticated
using (auth.uid() = user_id);

create policy "collections_upsert_own"
on public.player_collections
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
