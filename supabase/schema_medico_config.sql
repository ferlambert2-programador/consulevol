-- Tabla de configuración del médico
create table if not exists public.medico_config (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  nombre     text not null default '',
  matricula  text not null default '',
  lugar      text not null default '',
  direccion  text not null default '',
  telefono_consultorio text not null default '',
  telefono_secretaria  text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.medico_config enable row level security;

create policy "medico_config: select propio"
  on public.medico_config for select
  using (auth.uid() = user_id);

create policy "medico_config: insert propio"
  on public.medico_config for insert
  with check (auth.uid() = user_id);

create policy "medico_config: update propio"
  on public.medico_config for update
  using (auth.uid() = user_id);

-- Trigger updated_at
create trigger set_updated_at_medico_config
  before update on public.medico_config
  for each row execute procedure public.handle_updated_at();
