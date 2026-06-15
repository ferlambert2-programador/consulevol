'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Paciente } from '@/lib/types'

interface Props {
  paciente?: Paciente | null
  medicoId: string
  onGuardado: (paciente: Paciente) => void
  onCancelar: () => void
}

const VACIO: Omit<Paciente, 'id' | 'medico_id' | 'created_at' | 'updated_at'> = {
  nombre: '',
  apellido: '',
  fecha_nacimiento: null,
  obra_social: null,
  nro_afiliado: null,
  telefono: null,
  email: null,
  antecedentes: null,
  medicacion_habitual: null,
  alergias: null,
}

export default function FichaPaciente({ paciente, medicoId, onGuardado, onCancelar }: Props) {
  const [form, setForm] = useState({
    nombre: paciente?.nombre ?? '',
    apellido: paciente?.apellido ?? '',
    fecha_nacimiento: paciente?.fecha_nacimiento ?? '',
    obra_social: paciente?.obra_social ?? '',
    nro_afiliado: paciente?.nro_afiliado ?? '',
    telefono: paciente?.telefono ?? '',
    email: paciente?.email ?? '',
    antecedentes: paciente?.antecedentes ?? '',
    medicacion_habitual: paciente?.medicacion_habitual ?? '',
    alergias: paciente?.alergias ?? '',
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const esNuevo = !paciente

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError('Nombre y apellido son obligatorios')
      return
    }
    setGuardando(true)
    setError('')

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      fecha_nacimiento: form.fecha_nacimiento || null,
      obra_social: form.obra_social || null,
      nro_afiliado: form.nro_afiliado || null,
      telefono: form.telefono || null,
      email: form.email || null,
      antecedentes: form.antecedentes || null,
      medicacion_habitual: form.medicacion_habitual || null,
      alergias: form.alergias || null,
    }

    if (esNuevo) {
      const { data, error: err } = await supabase
        .from('pacientes')
        .insert({ ...payload, medico_id: medicoId })
        .select()
        .single()

      if (err) {
        setError('Error al guardar: ' + err.message)
        setGuardando(false)
        return
      }
      onGuardado(data)
    } else {
      const { data, error: err } = await supabase
        .from('pacientes')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', paciente.id)
        .select()
        .single()

      if (err) {
        setError('Error al actualizar: ' + err.message)
        setGuardando(false)
        return
      }
      onGuardado(data)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">
              {esNuevo ? 'Nuevo paciente' : `${paciente.apellido}, ${paciente.nombre}`}
            </h2>
            <p className="text-teal-200 text-xs">{esNuevo ? 'Completá los datos' : 'Editando ficha'}</p>
          </div>
        </div>
        <button onClick={onCancelar} className="text-white/70 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={guardar} className="p-6 space-y-6">
        {/* Datos personales */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Datos personales</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                Apellido <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.apellido}
                onChange={set('apellido')}
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="García"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={set('nombre')}
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="María"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                value={form.fecha_nacimiento}
                onChange={set('fecha_nacimiento')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={set('telefono')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="+54 11 1234-5678"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-slate-600 block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="paciente@email.com"
              />
            </div>
          </div>
        </section>

        {/* Cobertura */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cobertura médica</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Obra social / Prepaga</label>
              <input
                type="text"
                value={form.obra_social}
                onChange={set('obra_social')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="OSDE, Swiss Medical..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Nro. de afiliado</label>
              <input
                type="text"
                value={form.nro_afiliado}
                onChange={set('nro_afiliado')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="123456789"
              />
            </div>
          </div>
        </section>

        {/* Clínico */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Historia clínica</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Antecedentes patológicos</label>
              <textarea
                value={form.antecedentes}
                onChange={set('antecedentes')}
                rows={3}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                placeholder="HTA, DBT tipo 2, cirugías previas..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Medicación habitual</label>
              <textarea
                value={form.medicacion_habitual}
                onChange={set('medicacion_habitual')}
                rows={2}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                placeholder="Enalapril 10mg, Metformina 850mg..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">Alergias</label>
              <input
                type="text"
                value={form.alergias}
                onChange={set('alergias')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                placeholder="Penicilina, ibuprofeno..."
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {guardando ? 'Guardando...' : esNuevo ? 'Crear paciente' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
