'use client'

import { useState, useEffect, useRef } from 'react'
import { buscarMedicamento, type Medicamento } from '@/lib/vademecum'

interface Props {
  onCerrar: () => void
  onSeleccionar?: (texto: string) => void
}

export default function VademecumModal({ onCerrar, onSeleccionar }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Medicamento[]>([])
  const [copiado, setCopiado] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setResultados(buscarMedicamento(busqueda))
  }, [busqueda])

  const copiar = async (m: Medicamento) => {
    const texto = `${m.generico} (${m.forma}, ${m.presentacion})`
    await navigator.clipboard.writeText(texto)
    setCopiado(m.id)
    setTimeout(() => setCopiado(null), 2000)
    if (onSeleccionar) onSeleccionar(texto)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCerrar} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 rounded-t-2xl sm:rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg">💊</div>
            <div>
              <h2 className="text-white font-bold">Vademécum</h2>
              <p className="text-blue-200 text-xs">{resultados.length > 0 ? `${resultados.length} resultado${resultados.length > 1 ? 's' : ''}` : 'Buscá por nombre genérico o comercial'}</p>
            </div>
          </div>
          <button onClick={onCerrar} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Búsqueda */}
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ibuprofeno, Tafirol, omeprazol..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Resultados */}
        <div className="overflow-y-auto flex-1">
          {!busqueda.trim() || busqueda.length < 2 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="text-4xl mb-3">💊</div>
              <p className="text-sm font-medium">Escribí al menos 2 letras</p>
              <p className="text-xs mt-1">Busca por nombre genérico, comercial o categoría</p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm font-medium">Sin resultados para "{busqueda}"</p>
              <p className="text-xs mt-1">Probá con el nombre genérico</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {resultados.map((m) => (
                <div key={m.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{m.generico}</p>
                        <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full flex-shrink-0">{m.categoria}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <span className="font-medium">Forma:</span> {m.forma} · <span className="font-medium">Dosis:</span> {m.presentacion}
                      </p>
                      {m.comerciales.length > 0 && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          <span className="font-medium">Comercial:</span> {m.comerciales.join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => copiar(m)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        copiado === m.id
                          ? 'bg-green-500 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {copiado === m.id ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
          <p className="text-xs text-slate-400 text-center">96 medicamentos · Base local · Verificar dosis antes de prescribir</p>
        </div>
      </div>
    </div>
  )
}
