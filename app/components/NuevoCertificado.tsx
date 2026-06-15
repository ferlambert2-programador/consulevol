'use client'

import { useState, useRef } from 'react'
import type { Paciente } from '@/lib/types'
import type { TipoCertificado } from '@/lib/pdf/pdfCertificado'
import type { MedicoData } from '@/lib/pdf/plantilla'

interface Props {
  paciente: Paciente
  medico?: MedicoData
  onCerrar: () => void
}

const TIPOS: { id: TipoCertificado; label: string; descripcion: string }[] = [
  { id: 'laboral', label: 'Certificado laboral', descripcion: 'Apto para actividad laboral' },
  { id: 'buena_salud', label: 'Buena salud', descripcion: 'Estado general de salud satisfactorio' },
  { id: 'aptitud_fisica', label: 'Aptitud física', descripcion: 'Apto para práctica deportiva' },
]

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

const TIPO_LABELS: Record<TipoCertificado, string> = {
  laboral: 'laboral',
  buena_salud: 'de buena salud',
  aptitud_fisica: 'de aptitud física',
}

export default function NuevoCertificado({ paciente, medico, onCerrar }: Props) {
  const [tipo, setTipo] = useState<TipoCertificado>('laboral')
  const [dictado, setDictado] = useState('')
  const [textoCertificado, setTextoCertificado] = useState('')
  const [grabando, setGrabando] = useState(false)
  const [transcribiendo, setTranscribiendo] = useState(false)
  const [redactando, setRedactando] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')
  const [paso, setPaso] = useState<'dictado' | 'revision'>('dictado')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const toggleGrabacion = async () => {
    if (grabando) { mediaRecorderRef.current?.stop(); setGrabando(false); return }
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
    } catch { setError('No se pudo acceder al micrófono') }
  }

  const transcribir = async (blob: Blob) => {
    setTranscribiendo(true)
    try {
      const fd = new FormData()
      fd.append('audio', blob, 'audio.webm')
      const res = await fetch('/api/transcribir', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.texto) setDictado((p) => p ? p + ' ' + data.texto : data.texto)
      else setError('Error al transcribir')
    } catch { setError('Error de conexión') }
    finally { setTranscribiendo(false) }
  }

  const redactar = async () => {
    if (!dictado.trim()) { setError('Dictá o escribí algo primero'); return }
    setRedactando(true); setError('')
    try {
      const res = await fetch('/api/redactar-evolucion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dictado, antecedentes: null, medicacion: null }),
      })
      const data = await res.json()
      if (data.texto) { setTextoCertificado(data.texto); setPaso('revision') }
      else setError('Error al redactar')
    } catch { setError('Error de conexión') }
    finally { setRedactando(false) }
  }

  const generarPDF = async () => {
    setGenerando(true); setError('')
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { PDFCertificado } = await import('@/lib/pdf/pdfCertificado')

      const blob = await pdf(
        <PDFCertificado
          paciente={paciente}
          tipo={tipo}
          textoDictado={textoCertificado}
          medico={medico}
        />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const apellido = paciente.apellido.replace(/\s+/g, '_')
      a.download = `Certificado_${tipo}_${apellido}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError('Error al generar PDF: ' + e.message)
    } finally { setGenerando(false) }
  }

  const nombreMedico = medico?.nombre || 'Dr. Fernando Lambert'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Certificado médico</h2>
            <p className="text-violet-200 text-xs">{paciente.apellido}, {paciente.nombre}</p>
          </div>
        </div>
        <button onClick={onCerrar} className="text-white/70 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Tipo */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Tipo de certificado</label>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTipo(t.id)}
                className={`rounded-xl p-3 text-left border-2 transition-all text-sm ${
                  tipo === t.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`font-semibold block ${tipo === t.id ? 'text-violet-700' : 'text-slate-700'}`}>
                  {t.label}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">{t.descripcion}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dictado */}
        {paso === 'dictado' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Observaciones adicionales (opcional)
            </label>
            <button
              onClick={toggleGrabacion}
              disabled={transcribiendo}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm ${
                grabando ? 'bg-red-500 animate-pulse' : transcribiendo ? 'bg-slate-300 cursor-wait' : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {grabando ? '⏹ Detener' : transcribiendo ? 'Transcribiendo...' : '🎙 Dictar observaciones'}
            </button>
            <textarea
              value={dictado}
              onChange={(e) => setDictado(e.target.value)}
              rows={3}
              placeholder="Ej: válido por 30 días, para trámite ante... (dejá vacío para certificado estándar)"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition resize-none"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={onCerrar} className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                Cancelar
              </button>
              {dictado.trim() ? (
                <button
                  onClick={redactar}
                  disabled={redactando}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {redactando ? 'Redactando...' : '✨ Mejorar texto'}
                </button>
              ) : (
                <button
                  onClick={() => { setTextoCertificado(''); setPaso('revision') }}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Continuar sin observaciones
                </button>
              )}
            </div>
          </div>
        )}

        {/* Revisión */}
        {paso === 'revision' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vista previa del texto</label>
              <button onClick={() => setPaso('dictado')} className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                ← Volver
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-sm text-slate-700">
              <p className="font-semibold text-violet-700">
                {tipo === 'laboral' ? 'CERTIFICADO MÉDICO LABORAL' :
                 tipo === 'buena_salud' ? 'CERTIFICADO DE BUENA SALUD' :
                 'CERTIFICADO DE APTITUD FÍSICA'}
              </p>
              <p className="text-slate-500 text-xs">{medico?.lugar || 'Trenque Lauquen'}, Buenos Aires</p>
              <p className="leading-relaxed">
                <span className="font-medium">{paciente.apellido}, {paciente.nombre}</span> — Cobertura: {paciente.obra_social || 'no especificada'}
              </p>
              {textoCertificado && <p className="leading-relaxed">{textoCertificado}</p>}
              <p className="text-slate-400 text-xs">El presente certificado se extiende a solicitud del/la interesado/a...</p>
              <p className="font-semibold text-teal-700 text-xs">{nombreMedico} — {medico?.matricula || 'MP 115.740'}</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={onCerrar} className="flex-1 border border-slate-300 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                Cancelar
              </button>
              <button
                onClick={generarPDF}
                disabled={generando}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {generando ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generando PDF...</>
                ) : '⬇ Descargar certificado PDF'}
              </button>
            </div>

            {/* WhatsApp */}
            <div className="grid grid-cols-2 gap-2">
              {paciente.telefono && (
                <button
                  onClick={() => abrirWhatsApp(paciente.telefono!, `Hola ${paciente.nombre}, su certificado médico ${TIPO_LABELS[tipo]} está listo. Comuníquese con el consultorio para retirarlo.`)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-green-400 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
                >
                  <WhatsAppIcon />
                  Enviar al paciente
                </button>
              )}
              {medico?.telefono_secretaria && (
                <button
                  onClick={() => abrirWhatsApp(medico.telefono_secretaria!, `Certificado ${TIPO_LABELS[tipo]} para ${paciente.apellido}, ${paciente.nombre} listo para imprimir.`)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-green-400 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
                >
                  <WhatsAppIcon />
                  Enviar a secretaría
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}
