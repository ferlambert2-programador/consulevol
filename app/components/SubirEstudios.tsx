'use client'

import { useRef } from 'react'

export type TipoEstudio = 'laboratorio' | 'imagen' | 'ecg' | 'otro'

export interface EstudioLocal {
  file: File
  tipo: TipoEstudio
  preview: string
}

const TIPOS: { id: TipoEstudio; label: string; emoji: string }[] = [
  { id: 'laboratorio', label: 'Laboratorio', emoji: '🧪' },
  { id: 'imagen', label: 'Imágenes', emoji: '🩻' },
  { id: 'ecg', label: 'ECG', emoji: '❤️' },
  { id: 'otro', label: 'Otro', emoji: '📎' },
]

interface Props {
  estudios: EstudioLocal[]
  onChange: (estudios: EstudioLocal[]) => void
}

export default function SubirEstudios({ estudios, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const agregarArchivos = (files: FileList | null, tipo: TipoEstudio = 'otro') => {
    if (!files) return
    const nuevos: EstudioLocal[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') continue
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      nuevos.push({ file, tipo, preview })
    }
    onChange([...estudios, ...nuevos])
  }

  const cambiarTipo = (idx: number, tipo: TipoEstudio) => {
    const updated = estudios.map((e, i) => i === idx ? { ...e, tipo } : e)
    onChange(updated)
  }

  const eliminar = (idx: number) => {
    const e = estudios[idx]
    if (e.preview) URL.revokeObjectURL(e.preview)
    onChange(estudios.filter((_, i) => i !== idx))
  }

  const onDrop = (ev: React.DragEvent) => {
    ev.preventDefault()
    agregarArchivos(ev.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Estudios adjuntos
        </label>
        <span className="text-xs text-slate-400">{estudios.length > 0 ? `${estudios.length} archivo${estudios.length > 1 ? 's' : ''}` : 'Opcional'}</span>
      </div>

      {/* Zona de drop */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-colors"
      >
        <p className="text-slate-400 text-sm">
          🩻 <span className="font-medium">Arrastrá o hacé click</span> para agregar imágenes
        </p>
        <p className="text-slate-300 text-xs mt-0.5">Fotos de laboratorio, RX, ECG, etc.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => agregarArchivos(e.target.files)}
      />

      {/* Lista de archivos agregados */}
      {estudios.length > 0 && (
        <div className="space-y-2">
          {estudios.map((e, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
              {/* Miniatura */}
              {e.preview ? (
                <img src={e.preview} alt={e.file.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 text-lg">📄</div>
              )}

              {/* Nombre */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{e.file.name}</p>
                <p className="text-xs text-slate-400">{(e.file.size / 1024).toFixed(0)} KB</p>
              </div>

              {/* Tipo selector */}
              <select
                value={e.tipo}
                onChange={(ev) => cambiarTipo(idx, ev.target.value as TipoEstudio)}
                className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
              >
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                ))}
              </select>

              {/* Eliminar */}
              <button
                onClick={() => eliminar(idx)}
                className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
