'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import SubirEstudios, { type EstudioLocal } from './SubirEstudios'
import VademecumModal from './VademecumModal'
import type { Paciente, Consulta } from '@/lib/types'

interface Props {
  paciente: Paciente
  medicoId: string
  onGuardado: (consulta: Consulta) => void
  onCancelar: () => void
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function estudiosADescripcion(estudios: EstudioLocal[]): string {
  if (!estudios.length) return ''
  const grupos = estudios.reduce((acc, e) => {
    const label = e.tipo === 'laboratorio' ? 'Laboratorio' : e.tipo === 'imagen' ? 'Imágenes' : e.tipo === 'ecg' ? 'ECG' : 'Otro'
    if (!acc[label]) acc[label] = []
    acc[label].push(e.file.name)
    return acc
  }, {} as Record<string, string[]>)
  return Object.entries(grupos).map(([tipo, nombres]) => `${tipo}: ${nombres.join(', ')}`).join('; ')
}

export default function NuevaConsulta({ paciente, medicoId, onGuardado, onCancelar }: Props) {
  const [fecha, setFecha] = useState(todayISO())
  const [motivo, setMotivo] = useState('')
  const [dictado, setDictado] = useState('')
  const [redactado, setRedactado] = useState('')
  const [estudios, setEstudios] = useState<EstudioLocal[]>([])
  const [grabando, setGrabando] = useState(false)
  const [transcribiendo, setTranscribiendo] = useState(false)
  const [redactando, setRedactando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [error, setError] = useState('')
  const [paso, setPaso] = useState<'dictado' | 'revision'>('dictado')
  const [showVademecum, setShowVademecum] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const supabase = createClient()

  const toggleGrabacion = async () => {
    if (grabando) {
      mediaRecorderRef.current?.stop()
      setGrabando(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = (e) => chunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        await transcribir(new Blob(chunksRef.current, { type: 'audio/webm' }))
      }
      mr.start()
      mediaRecorderRef.current = mr
      setGrabando(true)
    } catch {
      setError('No se pudo acceder al micrófono')
    }
  }

  const transcribir = async (blob: Blob) => {
    setTranscribiendo(true)
    try {
      const fd = new FormData()
      fd.append('audio', blob, 'audio.webm')
      const res = await fetch('/api/transcribir', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.texto) setDictado((prev) => (prev ? prev + ' ' + data.texto : data.texto))
      else setError('Error al transcribir: ' + (data.error || 'desconocido'))
    } catch {
      setError('Error de conexión al transcribir')
    } finally {
      setTranscribiendo(false)
    }
  }

  const redactar = async () => {
    if (!dictado.trim()) { setError('Dictá o escribí algo primero'); return }
    setRedactando(true)
    setError('')
    try {
      const res = await fetch('/api/redactar-evolucion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dictado,
          antecedentes: paciente.antecedentes,
          medicacion: paciente.medicacion_habitual,
          estudios: estudiosADescripcion(estudios) || undefined,
        }),
      })
      const data = await res.json()
      if (data.texto) { setRedactado(data.texto); setPaso('revision') }
      else setError('Error al redactar: ' + (data.error || 'desconocido'))
    } catch {
      setError('Error de conexión')
    } finally {
      setRedactando(false)
    }
  }

  const guardar = async () => {
    if (!redactado.trim()) { setError('La evolución no puede estar vacía'); return }
    setGuardando(true)
    setError('')
    try {
      // 1. Crear consulta
      const { data: consulta, error: errConsulta } = await supabase
        .from('consultas')
        .insert({ paciente_id: paciente.id, medico_id: medicoId, fecha, motivo: motivo || null })
        .select()
        .single()
      if (errConsulta) throw new Error(errConsulta.message)

      // 2. Crear evolución
      const { error: errEvol } = await supabase
        .from('evoluciones')
        .insert({
          consulta_id: consulta.id,
          medico_id: medicoId,
          texto_dictado: dictado || null,
          texto_redactado: redactado,
        })
      if (errEvol) throw new Error(errEvol.message)

      // 3. Subir estudios a Storage
      if (estudios.length > 0) {
        for (const estudio of estudios) {
          const ext = estudio.file.name.split('.').pop() || 'jpg'
          const path = `${medicoId}/${consulta.id}/${Date.now()}_${estudio.tipo}.${ext}`
          const { error: errStorage } = await supabase.storage
            .from('estudios')
            .upload(path, estudio.file, { upsert: false })
          if (!errStorage) {
            await supabase.from('estudios').insert({
              consulta_id: consulta.id,
              medico_id: medicoId,
              tipo: estudio.tipo,
              nombre: estudio.file.name,
              storage_path: path,
            })
          }
        }
      }

      onGuardado(consulta)
    } catch (e: any) {
      setError('Error al guardar: ' + e.message)
      setGuardando(false)
    }
  }

  const copiar = async () => {
    await navigator.clipboard.writeText(redactado)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Nueva consulta</h2>
              <p className="text-emerald-100 text-xs">{paciente.apellido}, {paciente.nombre}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVademecum(true)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              title="Vademécum"
            >
              💊 Vademécum
            </button>
            <button onClick={onCancelar} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Alergias */}
          {paciente.alergias && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-red-500 text-sm font-bold">⚠ Alergias:</span>
              <span className="text-red-700 text-sm">{paciente.alergias}</span>
            </div>
          )}

          {/* Fecha y motivo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Motivo de consulta</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Control, fiebre, dolor..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>
          </div>

          {/* Dictado */}
          {paso === 'dictado' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Dictado de evolución</label>

              <button
                onClick={toggleGrabacion}
                disabled={transcribiendo}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                  grabando
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : transcribiendo
                    ? 'bg-slate-300 cursor-wait'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {grabando ? (
                  <><span className="w-3 h-3 rounded-sm bg-white inline-block" />Detener grabación</>
                ) : transcribiendo ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Transcribiendo...
                  </>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" /></svg>Iniciar dictado</>
                )}
              </button>

              <textarea
                value={dictado}
                onChange={(e) => setDictado(e.target.value)}
                rows={5}
                placeholder="El texto transcripto aparecerá acá. También podés escribir o editar directamente..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
              />

              {/* Estudios */}
              <SubirEstudios estudios={estudios} onChange={setEstudios} />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button onClick={onCancelar} className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                  Cancelar
                </button>
                <button
                  onClick={redactar}
                  disabled={redactando || !dictado.trim()}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {redactando ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Redactando...</>
                  ) : (
                    <>✨ Redactar con IA{estudios.length > 0 ? ` + ${estudios.length} estudio${estudios.length > 1 ? 's' : ''}` : ''}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Revisión */}
          {paso === 'revision' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evolución redactada</label>
                <button onClick={() => setPaso('dictado')} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  ← Volver a dictar
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-xs text-emerald-700 font-medium">Solo se mejoró la redacción. Revisá y editá si necesitás.</p>
              </div>

              <textarea
                value={redactado}
                onChange={(e) => setRedactado(e.target.value)}
                rows={7}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none leading-relaxed"
              />

              {estudios.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-blue-600 text-xs font-semibold">🩻 {estudios.length} estudio{estudios.length > 1 ? 's' : ''} se guardarán junto a esta consulta</span>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2">
                <button
                  onClick={copiar}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    copiado ? 'bg-green-500 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {copiado ? '✅ Copiado' : '📋 Copiar'}
                </button>
                <button
                  onClick={guardar}
                  disabled={guardando}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {guardando ? 'Guardando...' : 'Guardar consulta'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Vademécum */}
      {showVademecum && (
        <VademecumModal
          onCerrar={() => setShowVademecum(false)}
          onSeleccionar={(texto) => {
            setDictado(prev => prev ? prev + ' · ' + texto : texto)
            setShowVademecum(false)
          }}
        />
      )}
    </>
  )
}
