-- =============================================================================
--  Organiza — Schema do banco (Supabase / PostgreSQL)
--  Rode este script no SQL Editor do seu projeto Supabase.
--  Ele cria as tabelas e as políticas de segurança (RLS).
-- =============================================================================

-- ----------------------------------------------------------------------------
--  Tabela: lists
-- ----------------------------------------------------------------------------
create table if not exists public.lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 80),
  color      text not null default 'violet'
             check (color in ('violet','blue','emerald','amber','rose','cyan')),
  created_at timestamptz not null default now()
);

create index if not exists lists_user_id_idx on public.lists (user_id);

-- ----------------------------------------------------------------------------
--  Tabela: items
-- ----------------------------------------------------------------------------
create table if not exists public.items (
  id         uuid primary key default gen_random_uuid(),
  list_id    uuid not null references public.lists (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 500),
  is_done    boolean not null default false,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists items_list_id_idx on public.items (list_id);
create index if not exists items_user_id_idx on public.items (user_id);

-- =============================================================================
--  Row Level Security — cada usuário só acessa os PRÓPRIOS dados.
-- =============================================================================
alter table public.lists enable row level security;
alter table public.items enable row level security;

-- Políticas de lists ---------------------------------------------------------
drop policy if exists "lists_select_own" on public.lists;
create policy "lists_select_own" on public.lists
  for select using (auth.uid() = user_id);

drop policy if exists "lists_insert_own" on public.lists;
create policy "lists_insert_own" on public.lists
  for insert with check (auth.uid() = user_id);

drop policy if exists "lists_update_own" on public.lists;
create policy "lists_update_own" on public.lists
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lists_delete_own" on public.lists;
create policy "lists_delete_own" on public.lists
  for delete using (auth.uid() = user_id);

-- Políticas de items ---------------------------------------------------------
drop policy if exists "items_select_own" on public.items;
create policy "items_select_own" on public.items
  for select using (auth.uid() = user_id);

drop policy if exists "items_insert_own" on public.items;
create policy "items_insert_own" on public.items
  for insert with check (auth.uid() = user_id);

drop policy if exists "items_update_own" on public.items;
create policy "items_update_own" on public.items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "items_delete_own" on public.items;
create policy "items_delete_own" on public.items
  for delete using (auth.uid() = user_id);
