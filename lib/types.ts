export interface Paciente {
  id: string
  medico_id: string
  nombre: string
  apellido: string
  fecha_nacimiento: string | null
  obra_social: string | null
  nro_afiliado: string | null
  telefono: string | null
  email: string | null
  antecedentes: string | null
  medicacion_habitual: string | null
  alergias: string | null
  created_at: string
  updated_at: string
}

export interface Consulta {
  id: string
  paciente_id: string
  medico_id: string
  fecha: string
  motivo: string | null
  created_at: string
  evoluciones?: Evolucion[]
}

export interface Evolucion {
  id: string
  consulta_id: string
  medico_id: string
  texto_dictado: string | null
  texto_redactado: string
  created_at: string
  updated_at: string
}

export interface Medico {
  id: string
  nombre: string
  apellido: string
  matricula: string | null
  especialidad: string | null
  telefono: string | null
  email: string
}

export interface MedicoConfig {
  user_id: string
  nombre: string
  matricula: string
  lugar: string
  direccion: string
  telefono_consultorio: string
  telefono_secretaria: string
}

export interface Estudio {
  id: string
  consulta_id: string
  medico_id: string
  tipo: 'laboratorio' | 'imagen' | 'ecg' | 'otro'
  nombre: string
  storage_path: string
  created_at: string
}
