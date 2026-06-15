-- ============================================================
-- ConsulEvol - Schema Supabase
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Tabla de pacientes
create table if not exists public.pacientes (
  id            uuid primary key default gen_random_uuid(),
  medico_id     uuid not null references auth.users(id) on delete cascade,
  nombre        text not null,
  apellido      text not null,
  fecha_nacimiento date,
  obra_social   text,
  nro_afiliado  text,
  telefono      text,
  email         text,
  antecedentes  text,
  medicacion_habitual text,
  alergias      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Tabla de consultas (para historia clínica encadenada - Paso 2)
create table if not exists public.consultas (
  id            uuid primary key default gen_random_uuid(),
  paciente_id   uuid not null references public.pacientes(id) on delete cascade,
  medico_id     uuid not null references auth.users(id) on delete cascade,
  fecha         date not null default current_date,
  motivo        text,
  created_at    timestamptz not null default now()
);

-- Índices
create index if not exists idx_pacientes_medico on public.pacientes(medico_id);
create index if not exists idx_pacientes_apellido on public.pacientes(apellido);
create index if not exists idx_consultas_paciente on public.consultas(paciente_id);
create index if not exists idx_consultas_medico on public.consultas(medico_id);

-- Row Level Security: cada médico solo ve sus propios pacientes
alter table public.pacientes enable row level security;
alter table public.consultas enable row level security;

-- Políticas RLS para pacientes
create policy "medico_select_pacientes" on public.pacientes
  for select using (auth.uid() = medico_id);

create policy "medico_insert_pacientes" on public.pacientes
  for insert with check (auth.uid() = medico_id);

create policy "medico_update_pacientes" on public.pacientes
  for update using (auth.uid() = medico_id);

create policy "medico_delete_pacientes" on public.pacientes
  for delete using (auth.uid() = medico_id);

-- Políticas RLS para consultas
create policy "medico_select_consultas" on public.consultas
  for select using (auth.uid() = medico_id);

create policy "medico_insert_consultas" on public.consultas
  for insert with check (auth.uid() = medico_id);

create policy "medico_update_consultas" on public.consultas
  for update using (auth.uid() = medico_id);

create policy "medico_delete_consultas" on public.consultas
  for delete using (auth.uid() = medico_id);

-- Trigger para updated_at automático
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_pacientes
  before update on public.pacientes
  for each row execute function public.handle_updated_at();
