-- Migração 0001 — Campos extras nos itens: prioridade, prazo e nota.
-- Rode no SQL Editor do Supabase ANTES de publicar a versão que usa estes campos.

alter table public.items
  add column if not exists priority text
    check (priority in ('low', 'medium', 'high')),
  add column if not exists due_date date,
  add column if not exists note text
    check (note is null or char_length(note) <= 1000);

-- Índice para ordenar/filtrar por prazo com eficiência.
create index if not exists items_due_date_idx on public.items (due_date);
