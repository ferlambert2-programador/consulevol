import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `Sos un asistente de redacción médica. Tu tarea es generar un resumen narrativo claro y conciso de la historia clínica completa de un paciente, basado en las evoluciones cronológicas que se te proporcionan.

REGLAS:
- Redactá en prosa fluida, sin bullets ni listas
- Describí la evolución clínica del paciente a lo largo del tiempo
- Mencioná los motivos de consulta principales y su evolución
- NO interpretés síntomas ni hacés diagnósticos nuevos
- NO agregués información que no esté en las evoluciones
- Máximo 8 oraciones
- Usá el nombre del paciente al inicio`

export async function POST(req: NextRequest) {
  try {
    const { paciente, consultas } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })

    const lineas = consultas
      .map((c: any, i: number) =>
        `Consulta ${i + 1} (${c.fecha})${c.motivo ? ' — ' + c.motivo : ''}:\n${c.evolucion?.texto_redactado || 'Sin evolución registrada'}`
      )
      .join('\n\n')

    const userMessage = `PACIENTE: ${paciente.apellido}, ${paciente.nombre}
Antecedentes: ${paciente.antecedentes || 'Ninguno referido'}
Medicación habitual: ${paciente.medicacion_habitual || 'Ninguna'}

EVOLUCIONES CRONOLÓGICAS:
${lineas}

Generá un resumen narrativo de esta historia clínica para incluir en un PDF médico.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 })

    return NextResponse.json({ resumen: data.content?.[0]?.text || '' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
