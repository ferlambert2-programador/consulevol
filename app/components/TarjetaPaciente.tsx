'use client'

import { useState } from 'react'
import type { Paciente } from '@/lib/types'

interface Props {
  paciente: Paciente
  onEditar: () => void
  onCerrar: () => void
  onNuevaConsulta: () => void
}

function calcularEdad(fechaNacimiento: string | null): string {
  if (!fechaNacimiento) return 'Edad desconocida'
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return `${edad} años`
}

function formatFecha(iso: string | null): string {
  if (!iso) return 'N/A'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function Campo({ label, valor, grande }: { label: string; valor: string | null; grande?: boolean }) {
  if (!valor) return null
  return (
    <div className={grande ? 'col-span-2' : ''}>
      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</dt>
      <dd className={`text-sm text-slate-800 ${grande ? 'leading-relaxed' : ''}`}>{valor}</dd>
    </div>
  )
}

function limpiarTelefono(tel: string): string {
  const limpio = tel.replace(/\D/g, '')
  if (limpio.startsWith('549')) return limpio
  if (limpio.startsWith('54')) return limpio
  if (limpio.startsWith('0')) return '54' + limpio.slice(1)
  return '549' + limpio
}

export default function TarjetaPaciente({ paciente, onEditar, onCerrar, onNuevaConsulta }: Props) {
  const edad = calcularEdad(paciente.fecha_nacimiento)
  const [showTeleconsulta, setShowTeleconsulta] = useState(false)
  const [monto, setMonto] = useState('5000')
  const [generando, setGenerando] = useState(false)
  const [resultado, setResultado] = useState<{ pagoLink: string; jitsiLink: string } | null>(null)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState<'pago' | 'jitsi' | null>(null)

  const generarTeleconsulta = async () => {
    if (!monto || Number(monto) <= 0) { setError('Ingresá un monto válido'); return }
    setGenerando(true); setError('')
    try {
      const res = await fetch('/api/teleconsulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paciente, monto: Number(monto) }),
      })
      const data = await res.json()
      if (data.pagoLink) setResultado(data)
      else setError(data.error || 'Error al generar teleconsulta')
    } catch {
      setError('Error de conexión')
    } finally { setGenerando(false) }
  }

  const copiar = async (texto: string, tipo: 'pago' | 'jitsi') => {
    await navigator.clipboard.writeText(texto)
    setCopiado(tipo)
    setTimeout(() => setCopiado(null), 2000)
  }

  const enviarWhatsApp = (texto: string) => {
    if (!paciente.telefono) return
    const num = limpiarTelefono(paciente.telefono)
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {paciente.apellido.charAt(0)}{paciente.nombre.charAt(0)}
            </div>
            <div>
              <h2 className="text-white font-bold text-xl leading-tight">
                {paciente.apellido}, {paciente.nombre}
              </h2>
              <p className="text-teal-200 text-sm">
                {edad}
                {paciente.fecha_nacimiento && ` · Nac: ${formatFecha(paciente.fecha_nacimiento)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditar}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button onClick={onCerrar} className="text-white/70 hover:text-white transition-colors p-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="px-6 py-4 space-y-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Campo label="Teléfono" valor={paciente.telefono} />
          <Campo label="Obra social / Prepaga" valor={paciente.obra_social} />
          {paciente.nro_afiliado && <Campo label="Nro. afiliado" valor={paciente.nro_afiliado} />}
          {paciente.email && <Campo label="Email" valor={paciente.email} />}
        </dl>
        {!paciente.telefono && !paciente.obra_social && (
          <p className="text-slate-400 text-sm">Sin datos de contacto</p>
        )}

        {(paciente.antecedentes || paciente.medicacion_habitual) && (
          <div className="border-t border-slate-100 pt-3 grid grid-cols-1 gap-3">
            <Campo label="Antecedentes" valor={paciente.antecedentes} grande />
            <Campo label="Medicación habitual" valor={paciente.medicacion_habitual} grande />
          </div>
        )}

        {paciente.alergias && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <dt className="text-xs font-bold text-red-400 uppercase tracking-wider mb-0.5">⚠ Alergias</dt>
            <dd className="text-sm text-red-700 font-medium">{paciente.alergias}</dd>
          </div>
        )}

        {/* Acciones */}
        <div className="pt-1 grid grid-cols-2 gap-2">
          <button
            onClick={onNuevaConsulta}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva consulta
          </button>
          <button
            onClick={() => { setShowTeleconsulta(!showTeleconsulta); setResultado(null); setError('') }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            📹 Teleconsulta
          </button>
        </div>

        {/* Panel teleconsulta */}
        {showTeleconsulta && (
          <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Generar teleconsulta con pago</p>

            {!resultado ? (
              <>
                <div className="flex gap-2 items-center">
                  <label className="text-sm text-slate-600 font-medium whitespace-nowrap">Monto $</label>
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    min="1"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="5000"
                  />
                  <button
                    onClick={generarTeleconsulta}
                    disabled={generando}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                  >
                    {generando ? '...' : 'Generar'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                {!process.env.NEXT_PUBLIC_MP_CONFIGURED && (
                  <p className="text-xs text-amber-600">⚠ Configurá MERCADOPAGO_ACCESS_TOKEN en .env.local para habilitar pagos reales.</p>
                )}
              </>
            ) : (
              <div className="space-y-2">
                {/* Link de pago */}
                <div className="bg-white rounded-lg border border-indigo-200 p-3 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Link de pago Mercado Pago</p>
                  <p className="text-xs text-slate-600 break-all font-mono">{resultado.pagoLink}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copiar(resultado.pagoLink, 'pago')}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-all ${copiado === 'pago' ? 'bg-green-500 text-white border-green-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {copiado === 'pago' ? '✓ Copiado' : '📋 Copiar'}
                    </button>
                    {paciente.telefono && (
                      <button
                        onClick={() => enviarWhatsApp(`Hola ${paciente.nombre}! Para confirmar su teleconsulta, por favor abone a través de este link:\n${resultado.pagoLink}\n\nUna vez realizado el pago, le enviaré el link de la videollamada.`)}
                        className="flex-1 text-xs font-semibold py-1.5 rounded-lg border-2 border-green-400 text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <WhatsAppIcon /> WhatsApp
                      </button>
                    )}
                  </div>
                </div>

                {/* Link Jitsi */}
                <div className="bg-white rounded-lg border border-indigo-200 p-3 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Link de videollamada (Jitsi Meet)</p>
                  <p className="text-xs text-slate-600 break-all font-mono">{resultado.jitsiLink}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copiar(resultado.jitsiLink, 'jitsi')}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-all ${copiado === 'jitsi' ? 'bg-green-500 text-white border-green-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {copiado === 'jitsi' ? '✓ Copiado' : '📋 Copiar'}
                    </button>
                    <button
                      onClick={() => window.open(resultado.jitsiLink, '_blank')}
                      className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      📹 Entrar ahora
                    </button>
                    {paciente.telefono && (
                      <button
                        onClick={() => enviarWhatsApp(`Su pago fue confirmado. Ingrese a la teleconsulta con este link:\n${resultado.jitsiLink}`)}
                        className="flex-1 text-xs font-semibold py-1.5 rounded-lg border-2 border-green-400 text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <WhatsAppIcon /> Meet
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => { setResultado(null); setError('') }}
                  className="w-full text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1"
                >
                  ← Generar nueva teleconsulta
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
