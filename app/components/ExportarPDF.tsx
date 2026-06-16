'use client'

import { useState } from 'react'
import type { Paciente, Consulta, Evolucion } from '@/lib/types'
import type { MedicoData } from '@/lib/pdf/plantilla'

interface ConsultaConEvolucion extends Consulta {
  evolucion: Evolucion | null
}

interface PropsConsulta {
  modo: 'consulta'
  paciente: Paciente
  consulta: Consulta
  evolucion: Evolucion
  medico?: MedicoData
}

interface PropsHC {
  modo: 'hc'
  paciente: Paciente
  consultas: ConsultaConEvolucion[]
  medico?: MedicoData
}

type Props = PropsConsulta | PropsHC

type Destino = 'paciente' | 'secretaria'

export default function ExportarPDF(props: Props) {
  const [generando, setGenerando] = useState(false)
  const [compartiendo, setCompartiendo] = useState<Destino | null>(null)
  const [error, setError] = useState('')

  const apellido = props.paciente.apellido.replace(/\s+/g, '_')
  const hoy = new Date().toISOString().split('T')[0]
  const nombreArchivo = props.modo === 'consulta'
    ? `Evolucion_${apellido}_${props.consulta.fecha}.pdf`
    : `HC_${apellido}_${hoy}.pdf`

  const generarBlob = async (): Promise<Blob | null> => {
    try {
      const { pdf } = await import('@react-pdf/renderer')
      let docElement: React.ReactElement

      if (props.modo === 'consulta') {
        const { PDFConsulta } = await import('@/lib/pdf/pdfConsulta')
        docElement = (
          <PDFConsulta
            paciente={props.paciente}
            consulta={props.consulta}
            evolucion={props.evolucion}
            medico={props.medico}
          />
        )
      } else {
        let resumenIA = ''
        if (props.consultas.some(c => c.evolucion)) {
          const res = await fetch('/api/resumen-hc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paciente: props.paciente, consultas: props.consultas }),
          })
          const data = await res.json()
          resumenIA = data.resumen || ''
        }
        const { PDFHC } = await import('@/lib/pdf/pdfHC')
        docElement = (
          <PDFHC
            paciente={props.paciente}
            consultas={props.consultas}
            resumenIA={resumenIA}
            medico={props.medico}
          />
        )
      }
      return await pdf(docElement).toBlob()
    } catch {
      return null
    }
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
    const nombre = `${props.paciente.apellido}, ${props.paciente.nombre}`
    const titulo = props.modo === 'consulta'
      ? `Evolución — ${nombre}`
      : `Historia clínica — ${nombre}`
    const texto = destino === 'paciente'
      ? `Hola ${props.paciente.nombre}, le enviamos su documentación médica.`
      : `Documentación de ${nombre} para archivo.`

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: titulo, text: texto })
      } catch (e: any) {
        if (e.name !== 'AbortError') setError('No se pudo compartir')
      }
    } else {
      // Fallback desktop: descarga directa
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = nombreArchivo; a.click()
      URL.revokeObjectURL(url)
    }
    setCompartiendo(null)
  }

  const ocupado = generando || compartiendo !== null
  const label = props.modo === 'consulta' ? 'PDF' : 'PDF HC'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-1.5">
        {/* Descargar */}
        <button
          onClick={descargar}
          disabled={ocupado}
          title="Descargar PDF"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            generando
              ? 'border-slate-200 text-slate-400 cursor-wait'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {generando ? <Spinner /> : <>📄 {label}</>}
        </button>

        {/* Enviar al paciente */}
        <button
          onClick={() => compartir('paciente')}
          disabled={ocupado}
          title="Compartir PDF con el paciente"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            compartiendo === 'paciente'
              ? 'border-teal-200 text-teal-400 cursor-wait'
              : 'border-teal-300 text-teal-700 hover:bg-teal-50'
          }`}
        >
          {compartiendo === 'paciente' ? <Spinner /> : <><WhatsAppIcon /> Paciente</>}
        </button>

        {/* Enviar a secretaria */}
        <button
          onClick={() => compartir('secretaria')}
          disabled={ocupado}
          title="Compartir PDF con secretaría"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            compartiendo === 'secretaria'
              ? 'border-violet-200 text-violet-400 cursor-wait'
              : 'border-violet-300 text-violet-700 hover:bg-violet-50'
          }`}
        >
          {compartiendo === 'secretaria' ? <Spinner /> : <><WhatsAppIcon /> Secretaría</>}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}
