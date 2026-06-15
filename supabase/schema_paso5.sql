-- Paso 5: Tabla de estudios médicos
-- IMPORTANTE: Crear el bucket "estudios" (privado) manualmente en Supabase Storage

create table if not exists public.estudios (
  id           uuid primary key default gen_random_uuid(),
  consulta_id  uuid not null references public.consultas(id) on delete cascade,
  medico_id    uuid not null references auth.users(id),
  tipo         text not null check (tipo in ('laboratorio', 'imagen', 'ecg', 'otro')),
  nombre       text not null,
  storage_path text not null,
  created_at   timestamptz not null default now()
);

alter table public.estudios enable row level security;

create policy "estudios: select propio"
  on public.estudios for select using (auth.uid() = medico_id);

create policy "estudios: insert propio"
  on public.estudios for insert with check (auth.uid() = medico_id);

create policy "estudios: delete propio"
  on public.estudios for delete using (auth.uid() = medico_id);

-- Índice para cargar estudios de una consulta
create index if not exists estudios_consulta_id_idx on public.estudios(consulta_id);

-- ─── Storage RLS (ejecutar en Supabase Dashboard → Storage → Policies) ───────
-- Bucket: estudios (privado)
-- Policy SELECT: (storage.foldername(name))[1] = auth.uid()::text
-- Policy INSERT: (storage.foldername(name))[1] = auth.uid()::text
-- Policy DELETE: (storage.foldername(name))[1] = auth.uid()::text
