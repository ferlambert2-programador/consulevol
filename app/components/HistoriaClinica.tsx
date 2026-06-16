'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ExportarPDF from './ExportarPDF'
import type { Paciente, Consulta, Evolucion } from '@/lib/types'
import type { MedicoData } from '@/lib/pdf/plantilla'

interface Props {
  paciente: Paciente
  medico?: MedicoData
  onNuevaConsulta: () => void
  onCertificado: () => void
  refreshKey?: number
}

interface ConsultaConEvolucion extends Consulta {
  evolucion: Evolucion | null
}

function formatFechaLarga(iso: string): string {
  const partes = iso.split('T')[0].split('-')
  const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
  return fecha.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function limpiarTelefono(tel: string): string {
  const limpio = tel.replace(/\D/g, '')
  if (limpio.startsWith('549')) return limpio
  if (limpio.startsWith('54')) return limpio
  if (limpio.startsWith('0')) return '54' + limpio.slice(1)
  return '549' + limpio
}

function abrirWhatsApp(telefono: string, texto: string) {
  window.open(`https://wa.me/${limpiarTelefono(telefono)}?text=${encodeURIComponent(texto)}`, '_blank')
}

export default function HistoriaClinica({ paciente, medico, onNuevaConsulta, onCertificado, refreshKey }: Props) {
  const [consultas, setConsultas] = useState<ConsultaConEvolucion[]>([])
  const [cargando, setCargando] = useState(true)
  const [expandida, setExpandida] = useState<string | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [textoEdit, setTextoEdit] = useState('')
  const [guardandoEdit, setGuardandoEdit] = useState(false)
  const [confirmBorrar, setConfirmBorrar] = useState<string | null>(null)
  const [borrando, setBorrando] = useState(false)
  const supabase = createClient()

  const cargar = async () => {
    setCargando(true)
    const { data } = await supabase
      .from('consultas')
      .select('*, evoluciones(*)')
      .eq('paciente_id', paciente.id)
      .order('fecha', { ascending: false })

    if (data) {
      const lista: ConsultaConEvolucion[] = data.map((c: any) => ({
        ...c,
        evolucion: c.evoluciones?.[0] ?? null,
      }))
      setConsultas(lista)
      if (lista.length > 0 && !expandida) setExpandida(lista[0].id)
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [paciente.id, refreshKey])

  const copiar = async (texto: string, id: string) => {
    await navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(() => setCopiado(null), 2000)
  }

  const iniciarEdicion = (evolucion: Evolucion) => {
    setEditandoId(evolucion.id)
    setTextoEdit(evolucion.texto_redactado)
  }

  const guardarEdicion = async (consultaId: string, evolucionId: string) => {
    if (!textoEdit.trim()) return
    setGuardandoEdit(true)
    const { error } = await supabase
      .from('evoluciones')
      .update({ texto_redactado: textoEdit.trim(), updated_at: new Date().toISOString() })
      .eq('id', evolucionId)
    if (!error) {
      setConsultas(prev => prev.map(c =>
        c.id === consultaId && c.evolucion
          ? { ...c, evolucion: { ...c.evolucion, texto_redactado: textoEdit.trim() } }
          : c
      ))
      setEditandoId(null)
    }
    setGuardandoEdit(false)
  }

  const borrarConsulta = async (consultaId: string) => {
    setBorrando(true)
    await supabase.from('consultas').delete().eq('id', consultaId)
    setConsultas(prev => prev.filter(c => c.id !== consultaId))
    setConfirmBorrar(null)
    setBorrando(false)
  }

  return (
    <div className="space-y-3">
      {/* Cabecera */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historia clínica</h3>
        <div className="flex items-center gap-2">
          {consultas.length > 0 && (
            <ExportarPDF modo="hc" paciente={paciente} consultas={consultas} medico={medico} />
          )}
          <button
            onClick={onCertificado}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            📜 Certificado
          </button>
          <button
            onClick={onNuevaConsulta}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva consulta
          </button>
        </div>
      </div>

      {cargando && (
        <div className="text-center py-8">
          <svg className="w-5 h-5 text-teal-400 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {!cargando && consultas.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">Sin consultas previas</p>
          <p className="text-slate-400 text-xs mt-1">Esta es la primera vez que atendés a este paciente</p>
          <button
            onClick={onNuevaConsulta}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Registrar primera consulta
          </button>
        </div>
      )}

      {consultas.map((consulta, idx) => {
        const abierta = expandida === consulta.id
        const esReciente = idx === 0
        const editando = consulta.evolucion && editandoId === consulta.evolucion.id
        const confirmar = confirmBorrar === consulta.id

        return (
          <div
            key={consulta.id}
            className={`bg-white rounded-2xl border overflow-hidden transition-all ${
              esReciente ? 'border-teal-200 shadow-sm' : 'border-slate-200'
            }`}
          >
            <button
              onClick={() => setExpandida(abierta ? null : consulta.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  esReciente ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {consultas.length - idx}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold capitalize ${esReciente ? 'text-teal-800' : 'text-slate-700'}`}>
                    {formatFechaLarga(consulta.fecha)}
                  </p>
                  {consulta.motivo && (
                    <p className="text-xs text-slate-400 mt-0.5">{consulta.motivo}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {esReciente && (
                  <span className="text-xs bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">Última</span>
                )}
                {consulta.evolucion ? (
                  <span className="text-xs bg-emerald-50 text-emerald-600 font-medium px-2 py-0.5 rounded-full">Con evolución</span>
                ) : (
                  <span className="text-xs bg-amber-50 text-amber-600 font-medium px-2 py-0.5 rounded-full">Sin evolución</span>
                )}
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${abierta ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {abierta && (
              <div className="px-5 pb-5 border-t border-slate-100">
                {consulta.evolucion ? (
                  <div className="mt-4 space-y-3">
                    {/* Modo edición */}
                    {editando ? (
                      <div className="space-y-2">
                        <textarea
                          value={textoEdit}
                          onChange={(e) => setTextoEdit(e.target.value)}
                          rows={7}
                          autoFocus
                          className="w-full border border-teal-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none leading-relaxed"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditandoId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => guardarEdicion(consulta.id, consulta.evolucion!.id)}
                            disabled={guardandoEdit}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white transition-colors"
                          >
                            {guardandoEdit ? 'Guardando...' : '✓ Guardar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {consulta.evolucion.texto_redactado}
                          </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap justify-between gap-2">
                          {/* Izquierda: editar y borrar */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => iniciarEdicion(consulta.evolucion!)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              ✏️ Editar
                            </button>
                            {!confirmar ? (
                              <button
                                onClick={() => setConfirmBorrar(consulta.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                              >
                                🗑 Borrar
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-red-600 font-semibold">¿Borrar consulta?</span>
                                <button
                                  onClick={() => borrarConsulta(consulta.id)}
                                  disabled={borrando}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:bg-slate-300"
                                >
                                  {borrando ? '...' : 'Sí, borrar'}
                                </button>
                                <button
                                  onClick={() => setConfirmBorrar(null)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Derecha: PDF, copiar, WhatsApp */}
                          <div className="flex flex-wrap gap-2">
                            <ExportarPDF
                              modo="consulta"
                              paciente={paciente}
                              consulta={consulta}
                              evolucion={consulta.evolucion!}
                              medico={medico}
                            />
                            <button
                              onClick={() => copiar(consulta.evolucion!.texto_redactado, consulta.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                copiado === consulta.id
                                  ? 'bg-green-500 text-white'
                                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {copiado === consulta.id ? '✅ Copiado' : '📋 Copiar'}
                            </button>
                            {paciente.telefono && (
                              <button
                                onClick={() => abrirWhatsApp(
                                  paciente.telefono!,
                                  `Hola ${paciente.nombre}, le enviamos un resumen de su consulta del ${formatFechaLarga(consulta.fecha)}:\n\n${consulta.evolucion?.texto_redactado || ''}`
                                )}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <WhatsAppIcon />
                                Paciente
                              </button>
                            )}
                            {medico?.telefono_secretaria && (
                              <button
                                onClick={() => abrirWhatsApp(
                                  medico.telefono_secretaria!,
                                  `Evolución ${paciente.apellido}, ${paciente.nombre} — ${formatFechaLarga(consulta.fecha)}:\n\n${consulta.evolucion?.texto_redactado || ''}`
                                )}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <WhatsAppIcon />
                                Secretaría
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <p className="text-slate-400 text-sm text-center">Esta consulta no tiene evolución registrada</p>
                    <div className="flex justify-center">
                      {!confirmar ? (
                        <button
                          onClick={() => setConfirmBorrar(consulta.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          🗑 Borrar consulta vacía
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 font-semibold">¿Borrar esta consulta?</span>
                          <button
                            onClick={() => borrarConsulta(consulta.id)}
                            disabled={borrando}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                          >
                            {borrando ? '...' : 'Sí'}
                          </button>
                          <button
                            onClick={() => setConfirmBorrar(null)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}
