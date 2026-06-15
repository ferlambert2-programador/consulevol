import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `Sos un asistente de redacción médica. Tu única función es ordenar y mejorar la redacción del dictado del médico.

REGLAS ESTRICTAS:
- Usá el dictado tal como está: no agregues información, no omitas datos mencionados
- NO interpretés síntomas ni sugerís diagnósticos
- NO recomendés tratamientos ni medicamentos
- NO inferís datos que el médico no dijo explícitamente
- Corregí ortografía, puntuación y gramática
- Organizá el texto en prosa fluida, sin bullets ni listas
- Máximo 6 oraciones
- Usá terminología médica correcta para los términos que el médico ya usó
- El resultado debe ser el mismo dictado, mejor redactado`

export async function POST(req: NextRequest) {
  try {
    const { dictado, antecedentes, medicacion, estudios } = await req.json()

    if (!dictado?.trim()) {
      return NextResponse.json({ error: 'Sin dictado' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })

    let contexto = ''
    if (antecedentes) contexto += `\nAntecedentes del paciente: ${antecedentes}`
    if (medicacion) contexto += `\nMedicación habitual: ${medicacion}`
    if (estudios) contexto += `\nEstudios adjuntos en esta consulta: ${estudios}`

    const userMessage = `${contexto ? `CONTEXTO DEL PACIENTE:${contexto}\n\n` : ''}DICTADO DEL MÉDICO:\n${dictado}\n\nRedactá el dictado de forma clara y profesional. Si hay estudios adjuntos, mencionarlos brevemente al final de la evolución. Solo mejorá la redacción, no interpretés ni agregués información.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: data.error?.message || 'Error API' }, { status: 500 })

    const texto = data.content?.[0]?.text || ''
    return NextResponse.json({ texto })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
