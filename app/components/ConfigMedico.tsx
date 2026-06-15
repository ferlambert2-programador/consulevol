'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MedicoConfig } from '@/lib/types'

interface Props {
  userId: string
  onCerrar: () => void
  onGuardado: (config: MedicoConfig) => void
}

const CAMPOS: { key: keyof Omit<MedicoConfig, 'user_id'>; label: string; placeholder: string }[] = [
  { key: 'nombre', label: 'Nombre completo', placeholder: 'Dr. Juan Pérez' },
  { key: 'matricula', label: 'Matrícula (MP)', placeholder: 'MP 12.345' },
  { key: 'lugar', label: 'Lugar', placeholder: 'Trenque Lauquen' },
  { key: 'direccion', label: 'Dirección del consultorio', placeholder: 'Av. San Martín 123' },
  { key: 'telefono_consultorio', label: 'Tel. consultorio', placeholder: '02392-XXXXXX' },
  { key: 'telefono_secretaria', label: 'Tel. secretaría', placeholder: '11-XXXX-XXXX' },
]

export default function ConfigMedico({ userId, onCerrar, onGuardado }: Props) {
  const [form, setForm] = useState<Omit<MedicoConfig, 'user_id'>>({
    nombre: '', matricula: '', lugar: '', direccion: '',
    telefono_consultorio: '', telefono_secretaria: '',
  })
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('medico_config')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (data) {
        setForm({
          nombre: data.nombre || '',
          matricula: data.matricula || '',
          lugar: data.lugar || '',
          direccion: data.direccion || '',
          telefono_consultorio: data.telefono_consultorio || '',
          telefono_secretaria: data.telefono_secretaria || '',
        })
      }
      setCargando(false)
    }
    cargar()
  }, [userId])

  const guardar = async () => {
    setGuardando(true); setError('')
    const { error: err } = await supabase
      .from('medico_config')
      .upsert({ user_id: userId, ...form })
    if (err) {
      setError('Error al guardar: ' + err.message)
    } else {
      setExito(true)
      onGuardado({ user_id: userId, ...form })
      setTimeout(() => setExito(false), 2000)
    }
    setGuardando(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Ajustes del consultorio</h2>
            <p className="text-slate-300 text-xs">Estos datos aparecen en todos los PDFs</p>
          </div>
        </div>
        <button onClick={onCerrar} className="text-white/70 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        {cargando ? (
          <div className="flex justify-center py-8">
            <svg className="w-5 h-5 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAMPOS.map(({ key, label, placeholder }) => (
                <div key={key} className={key === 'nombre' || key === 'direccion' ? 'sm:col-span-2' : ''}>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {exito && (
              <p className="text-emerald-600 text-sm font-medium">✓ Datos guardados correctamente</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onCerrar}
                className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {guardando ? 'Guardando...' : 'Guardar ajustes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
