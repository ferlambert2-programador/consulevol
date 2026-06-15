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

export default function ExportarPDF(props: Props) {
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')

  const generar = async () => {
    setGenerando(true)
    setError('')
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

      const blob = await pdf(docElement).toBlob()
      const url = URL.createObjectURL(blob)

      const apellido = props.paciente.apellido.replace(/\s+/g, '_')
      const hoy = new Date().toISOString().split('T')[0]
      const nombre = props.modo === 'consulta'
        ? `Evolucion_${apellido}_${props.consulta.fecha}.pdf`
        : `HC_${apellido}_${hoy}.pdf`

      const a = document.createElement('a')
      a.href = url
      a.download = nombre
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setError('Error al generar PDF: ' + e.message)
    } finally {
      setGenerando(false)
    }
  }

  const label = props.modo === 'consulta' ? 'PDF consulta' : 'PDF historia clínica'
  const icon = props.modo === 'consulta' ? '📄' : '📋'

  return (
    <div>
      <button
        onClick={generar}
        disabled={generando}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          generando
            ? 'border-slate-200 text-slate-400 cursor-wait'
            : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        {generando ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generando...
          </>
        ) : (
          <>{icon} {label}</>
        )}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
