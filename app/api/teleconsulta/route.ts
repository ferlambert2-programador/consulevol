import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { paciente, monto } = await req.json()

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'MERCADOPAGO_ACCESS_TOKEN no configurado' }, { status: 500 })
    }

    // Crear preferencia de pago en Mercado Pago
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [{
          title: 'Teleconsulta médica',
          quantity: 1,
          unit_price: Number(monto),
          currency_id: 'ARS',
        }],
        payer: {
          name: paciente.nombre,
          surname: paciente.apellido,
          email: paciente.email || undefined,
        },
        statement_descriptor: 'ConsulEvol',
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.message || 'Error en Mercado Pago' }, { status: 500 })
    }

    const data = await res.json()

    // Link de Jitsi Meet — gratuito, sin auth
    const roomId = randomUUID().replace(/-/g, '').slice(0, 12)
    const jitsiLink = `https://meet.jit.si/ConsulEvol-${roomId}`

    return NextResponse.json({
      pagoLink: data.init_point,
      jitsiLink,
      preferenciaId: data.id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
