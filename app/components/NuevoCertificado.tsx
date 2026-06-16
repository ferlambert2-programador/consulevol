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
  { id: 'reposo_laboral', label: 'Reposo laboral', descripcion: 'Indicación de reposo médico' },
  { id: 'buena_salud', label: 'Buena salud', descripcion: 'Estado general satisfactorio' },
  { id: 'aptitud_fisica', label: 'Aptitud física', descripcion: 'Apto para práctica deportiva' },
]

const TIPO_TITULOS: Record<TipoCertificado, string> = {
  laboral: 'CERTIFICADO MÉDICO LABORAL',
  reposo_laboral: 'CERTIFICADO DE REPOSO LABORAL',
  buena_salud: 'CERTIFICADO DE BUENA SALUD',
  aptitud_fisica: 'CERTIFICADO DE APTITUD FÍSICA',
}

type Destino = 'paciente' | 'secretaria'

export default function NuevoCertificado({ paciente, medico, onCerrar }: Props) {
  const [tipo, setTipo] = useState<TipoCertificado>('laboral')
  const [dictado, setDictado] = useState('')
  const [textoCertificado, setTextoCertificado] = useState('')
  const [grabando, setGrabando] = useState(false)
  const [transcribiendo, setTranscribiendo] = useState(false)
  const [redactando, setRedactando] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [compartiendo, setCompartiendo] = useState<Destino | null>(null)
  const [error, setError] = useState('')
  const [paso, setPaso] = useState<'dictado' | 'revision'>('dictado')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const esReposo = tipo === 'reposo_laboral'
  const ocupado = generando || compartiendo !== null
  const apellidoLimpio = paciente.apellido.replace(/\s+/g, '_')
  const nombreArchivo = `Certificado_${tipo}_${apellidoLimpio}.pdf`

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

  const generarBlob = async (): Promise<Blob | null> => {
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { PDFCertificado } = await import('@/lib/pdf/pdfCertificado')
      return await pdf(
        <PDFCertificado
          paciente={paciente}
          tipo={tipo}
          textoDictado={textoCertificado}
          medico={medico}
        />
      ).toBlob()
    } catch { return null }
  }

  const descargar = async () => {
    setGenerando(true); setError('')
    const blob = await generarBlob()
    if (!blob) { setError('Error al generar PDF'); setGenerando(false); return }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = nombreArchivo; a.click()
    URL.revokeObjectURL(url)
    setGenerando(false)
  }

  const compartir = async (destino: Destino) => {
    setCompartiendo(destino); setError('')
    const blob = await generarBlob()
    if (!blob) { setError('Error al generar PDF'); setCompartiendo(null); return }

    const file = new File([blob], nombreArchivo, { type: 'application/pdf' })
    const titulo = `${TIPO_TITULOS[tipo]} — ${paciente.apellido}, ${paciente.nombre}`
    const texto = destino === 'paciente'
      ? `Hola ${paciente.nombre}, le enviamos su certificado médico.`
      : `Certificado de ${paciente.apellido}, ${paciente.nombre} para archivo.`

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: titulo, text: texto })
      } catch (e: any) {
        if (e.name !== 'AbortError') setError('No se pudo compartir')
      }
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = nombreArchivo; a.click()
      URL.revokeObjectURL(url)
    }
    setCompartiendo(null)
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
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTipo(t.id); setDictado(''); setTextoCertificado(''); setPaso('dictado') }}
                className={`rounded-xl p-3 text-left border-2 transition-all text-sm ${
                  tipo === t.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`font-semibold block ${tipo === t.id ? 'text-violet-700' : 'text-slate-700'}`}>{t.label}</span>
                <span className="text-xs text-slate-400 mt-0.5 block">{t.descripcion}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dictado */}
        {paso === 'dictado' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {esReposo ? 'Contenido del certificado de reposo' : 'Observaciones adicionales (opcional)'}
            </label>
            {esReposo && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700">
                Dictá los días de reposo, diagnóstico y cualquier indicación. La IA solo corregirá la gramática.
              </div>
            )}
            <button
              onClick={toggleGrabacion}
              disabled={transcribiendo}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm ${
                grabando ? 'bg-red-500 animate-pulse' : transcribiendo ? 'bg-slate-300 cursor-wait' : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              {grabando ? '⏹ Detener' : transcribiendo ? 'Transcribiendo...' : `🎙 Dictar ${esReposo ? 'contenido' : 'observaciones'}`}
            </button>
            <textarea
              value={dictado}
              onChange={(e) => setDictado(e.target.value)}
              rows={esReposo ? 5 : 3}
              placeholder={esReposo
                ? 'Ej: "Certifico que el paciente debe guardar reposo laboral por 5 días a partir del día de la fecha, por diagnóstico de síndrome gripal."'
                : 'Ej: válido por 30 días, para trámite ante... (dejá vacío para certificado estándar)'}
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
                  {redactando ? 'Corrigiendo...' : esReposo ? '✨ Corregir gramática' : '✨ Mejorar texto'}
                </button>
              ) : !esReposo ? (
                <button
                  onClick={() => { setTextoCertificado(''); setPaso('revision') }}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Continuar sin observaciones
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Revisión */}
        {paso === 'revision' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vista previa</label>
              <button onClick={() => setPaso('dictado')} className="text-xs text-violet-600 hover:text-violet-700 font-medium">← Volver</button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-sm text-slate-700">
              <p className="font-semibold text-violet-700">{TIPO_TITULOS[tipo]}</p>
              <p className="text-slate-500 text-xs">{medico?.lugar || 'Trenque Lauquen'}, Buenos Aires</p>
              <p className="leading-relaxed">
                <span className="font-medium">{paciente.apellido}, {paciente.nombre}</span>
                {paciente.obra_social && ` — Cobertura: ${paciente.obra_social}`}
              </p>
              {textoCertificado && <p className="leading-relaxed">{textoCertificado}</p>}
              <p className="text-slate-400 text-xs">El presente certificado se extiende a solicitud del/la interesado/a...</p>
              <p className="font-semibold text-teal-700 text-xs">{nombreMedico} — {medico?.matricula || 'MP 115.740'}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Editar texto</label>
              <textarea
                value={textoCertificado}
                onChange={(e) => setTextoCertificado(e.target.value)}
                rows={4}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Botón descargar */}
            <button
              onClick={descargar}
              disabled={ocupado}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {generando ? <><Spinner /> Generando PDF...</> : '⬇ Descargar certificado PDF'}
            </button>

            {/* Botones compartir Web Share API */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => compartir('paciente')}
                disabled={ocupado}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors ${
                  compartiendo === 'paciente'
                    ? 'border-teal-200 text-teal-400 cursor-wait'
                    : 'border-teal-400 text-teal-700 hover:bg-teal-50'
                }`}
              >
                {compartiendo === 'paciente' ? <Spinner /> : <WhatsAppIcon />}
                Enviar a paciente
              </button>
              <button
                onClick={() => compartir('secretaria')}
                disabled={ocupado}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors ${
                  compartiendo === 'secretaria'
                    ? 'border-violet-200 text-violet-400 cursor-wait'
                    : 'border-violet-400 text-violet-700 hover:bg-violet-50'
                }`}
              >
                {compartiendo === 'secretaria' ? <Spinner /> : <WhatsAppIcon />}
                Enviar a secretaría
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}
