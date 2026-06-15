-- ============================================================
-- ConsulEvol - Schema Paso 2: Evoluciones
-- Ejecutar en Supabase SQL Editor (después del schema_paso1.sql)
-- ============================================================

-- Tabla de evoluciones (vinculada a consultas)
create table if not exists public.evoluciones (
  id                uuid primary key default gen_random_uuid(),
  consulta_id       uuid not null references public.consultas(id) on delete cascade,
  medico_id         uuid not null references auth.users(id) on delete cascade,
  texto_dictado     text,
  texto_redactado   text not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Índices
create index if not exists idx_evoluciones_consulta on public.evoluciones(consulta_id);
create index if not exists idx_evoluciones_medico   on public.evoluciones(medico_id);

-- RLS
alter table public.evoluciones enable row level security;

create policy "medico_select_evoluciones" on public.evoluciones
  for select using (auth.uid() = medico_id);

create policy "medico_insert_evoluciones" on public.evoluciones
  for insert with check (auth.uid() = medico_id);

create policy "medico_update_evoluciones" on public.evoluciones
  for update using (auth.uid() = medico_id);

create policy "medico_delete_evoluciones" on public.evoluciones
  for delete using (auth.uid() = medico_id);

-- Trigger updated_at
create trigger set_updated_at_evoluciones
  before update on public.evoluciones
  for each row execute function public.handle_updated_at();
