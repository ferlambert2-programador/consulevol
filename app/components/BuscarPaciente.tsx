'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Paciente } from '@/lib/types'

interface Props {
  onSeleccionar: (paciente: Paciente) => void
  onNuevo: () => void
}

export default function BuscarPaciente({ onSeleccionar, onNuevo }: Props) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Paciente[]>([])
  const [buscando, setBuscando] = useState(false)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResultados([])
      setMostrarDropdown(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setBuscando(true)
      const termino = query.trim()
      const { data } = await supabase
        .from('pacientes')
        .select('*')
        .or(`nombre.ilike.%${termino}%,apellido.ilike.%${termino}%`)
        .order('apellido', { ascending: true })
        .limit(10)

      setResultados(data || [])
      setMostrarDropdown(true)
      setBuscando(false)
    }, 300)
  }, [query])

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {buscando ? (
              <svg className="w-4 h-4 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => resultados.length > 0 && setMostrarDropdown(true)}
            onBlur={() => setTimeout(() => setMostrarDropdown(false), 150)}
            placeholder="Buscar por nombre o apellido..."
            className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>
        <button
          onClick={onNuevo}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors whitespace-nowrap text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo paciente
        </button>
      </div>

      {mostrarDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {resultados.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400 text-center">
              No se encontraron pacientes
            </div>
          ) : (
            resultados.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => {
                  onSeleccionar(p)
                  setQuery('')
                  setMostrarDropdown(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <div className="font-semibold text-slate-800 text-sm">
                  {p.apellido}, {p.nombre}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {p.obra_social && <span>{p.obra_social}</span>}
                  {p.obra_social && p.telefono && <span className="mx-1">·</span>}
                  {p.telefono && <span>{p.telefono}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
