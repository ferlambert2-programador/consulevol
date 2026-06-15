'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from './Header'
import BuscarPaciente from './BuscarPaciente'
import FichaPaciente from './FichaPaciente'
import TarjetaPaciente from './TarjetaPaciente'
import NuevaConsulta from './NuevaConsulta'
import HistoriaClinica from './HistoriaClinica'
import NuevoCertificado from './NuevoCertificado'
import ConfigMedico from './ConfigMedico'
import type { Paciente, Consulta, MedicoConfig } from '@/lib/types'
import type { MedicoData } from '@/lib/pdf/plantilla'

interface Props {
  userEmail: string
  userId: string
}

type Vista = 'buscar' | 'nuevo' | 'ficha' | 'editar' | 'nueva_consulta' | 'certificado' | 'ajustes'

function configToMedicoData(c: MedicoConfig): MedicoData {
  return {
    nombre: c.nombre,
    matricula: c.matricula,
    lugar: c.lugar,
    direccion: c.direccion,
    telefono_consultorio: c.telefono_consultorio,
    telefono_secretaria: c.telefono_secretaria,
  }
}

export default function Dashboard({ userEmail, userId }: Props) {
  const [vista, setVista] = useState<Vista>('buscar')
  const [pacienteActivo, setPacienteActivo] = useState<Paciente | null>(null)
  const [refreshHC, setRefreshHC] = useState(0)
  const [medicoConfig, setMedicoConfig] = useState<MedicoConfig | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const cargarConfig = async () => {
      const { data } = await supabase
        .from('medico_config')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (data) setMedicoConfig(data as MedicoConfig)
    }
    cargarConfig()
  }, [userId])

  const seleccionarPaciente = (p: Paciente) => {
    setPacienteActivo(p)
    setVista('ficha')
  }

  const alGuardarFicha = (p: Paciente) => {
    setPacienteActivo(p)
    setVista('ficha')
  }

  const alGuardarConsulta = (_consulta: Consulta) => {
    setRefreshHC((n) => n + 1)
    setVista('ficha')
  }

  const vistaAnteriorAjustes = (): Vista => pacienteActivo ? 'ficha' : 'buscar'

  const medicoData = medicoConfig ? configToMedicoData(medicoConfig) : undefined
  const vistaBusquedaVisible = vista === 'buscar' || vista === 'ficha'

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        email={userEmail}
        onAjustes={() => setVista('ajustes')}
      />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {vistaBusquedaVisible && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buscar paciente</p>
            <BuscarPaciente
              onSeleccionar={seleccionarPaciente}
              onNuevo={() => { setPacienteActivo(null); setVista('nuevo') }}
            />
          </div>
        )}

        {vista === 'ficha' && pacienteActivo && (
          <>
            <TarjetaPaciente
              paciente={pacienteActivo}
              onEditar={() => setVista('editar')}
              onCerrar={() => { setPacienteActivo(null); setVista('buscar') }}
              onNuevaConsulta={() => setVista('nueva_consulta')}
            />
            <HistoriaClinica
              paciente={pacienteActivo}
              medico={medicoData}
              onNuevaConsulta={() => setVista('nueva_consulta')}
              onCertificado={() => setVista('certificado')}
              refreshKey={refreshHC}
            />
          </>
        )}

        {vista === 'nuevo' && (
          <FichaPaciente
            medicoId={userId}
            onGuardado={alGuardarFicha}
            onCancelar={() => setVista('buscar')}
          />
        )}

        {vista === 'editar' && pacienteActivo && (
          <FichaPaciente
            paciente={pacienteActivo}
            medicoId={userId}
            onGuardado={alGuardarFicha}
            onCancelar={() => setVista('ficha')}
          />
        )}

        {vista === 'nueva_consulta' && pacienteActivo && (
          <NuevaConsulta
            paciente={pacienteActivo}
            medicoId={userId}
            onGuardado={alGuardarConsulta}
            onCancelar={() => setVista('ficha')}
          />
        )}

        {vista === 'certificado' && pacienteActivo && (
          <NuevoCertificado
            paciente={pacienteActivo}
            medico={medicoData}
            onCerrar={() => setVista('ficha')}
          />
        )}

        {vista === 'ajustes' && (
          <ConfigMedico
            userId={userId}
            onCerrar={() => setVista(vistaAnteriorAjustes())}
            onGuardado={(config) => setMedicoConfig(config)}
          />
        )}

        {vista === 'buscar' && (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Buscá un paciente o creá uno nuevo</p>
            <p className="text-slate-400 text-sm">Escribí al menos 2 letras para buscar</p>
          </div>
        )}
      </div>
    </div>
  )
}
