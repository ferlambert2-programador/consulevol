import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Header, Footer, Firma, styles, MEDICO_DEFAULT } from './plantilla'
import type { MedicoData } from './plantilla'
import type { Paciente } from '@/lib/types'

const certStyles = StyleSheet.create({
  tituloCert: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0f766e',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 8,
  },
  subtituloCert: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  cuerpoLegal: {
    fontSize: 10.5,
    lineHeight: 1.8,
    color: '#1e293b',
    textAlign: 'justify',
  },
  bloqueSello: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lugarFecha: {
    fontSize: 10,
    color: '#475569',
  },
})

export type TipoCertificado = 'laboral' | 'buena_salud' | 'aptitud_fisica' | 'reposo_laboral'

const TITULOS: Record<TipoCertificado, string> = {
  laboral: 'CERTIFICADO MÉDICO LABORAL',
  buena_salud: 'CERTIFICADO DE BUENA SALUD',
  aptitud_fisica: 'CERTIFICADO DE APTITUD FÍSICA',
  reposo_laboral: 'CERTIFICADO DE REPOSO LABORAL',
}

function calcularEdad(fn: string | null): number | null {
  if (!fn) return null
  const hoy = new Date(), nac = new Date(fn)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

function formatFechaHoy(): string {
  return new Date().toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function introduccion(paciente: Paciente, tipo: TipoCertificado, medico: MedicoData): string {
  const edad = calcularEdad(paciente.fecha_nacimiento)
  const edadStr = edad ? `, de ${edad} años de edad,` : ''
  const cobertura = paciente.obra_social ? `, afiliado/a a ${paciente.obra_social}` : ''

  switch (tipo) {
    case 'laboral':
      return `El suscripto, ${medico.nombre} (${medico.matricula}), certifica haber examinado a ${paciente.apellido}, ${paciente.nombre}${edadStr}${cobertura}, quien se presenta en buen estado de salud general, sin contraindicaciones para el desempeño de sus actividades laborales habituales.`
    case 'buena_salud':
      return `El suscripto, ${medico.nombre} (${medico.matricula}), certifica haber examinado en el día de la fecha a ${paciente.apellido}, ${paciente.nombre}${edadStr}${cobertura}, quien presenta buen estado de salud general.`
    case 'aptitud_fisica':
      return `El suscripto, ${medico.nombre} (${medico.matricula}), certifica haber realizado evaluación clínica a ${paciente.apellido}, ${paciente.nombre}${edadStr}${cobertura}, quien se encuentra en condiciones físicas aptas para la práctica de actividad física.`
    case 'reposo_laboral':
      return ''
  }
}

interface Props {
  paciente: Paciente
  tipo: TipoCertificado
  textoDictado: string
  medico?: MedicoData
  fechaEmision?: string
}

export function PDFCertificado({ paciente, tipo, textoDictado, medico = MEDICO_DEFAULT, fechaEmision }: Props) {
  const fecha = fechaEmision || formatFechaHoy()
  const intro = introduccion(paciente, tipo, medico)

  return (
    <Document
      title={`${TITULOS[tipo]} — ${paciente.apellido} ${paciente.nombre}`}
      author="ConsulEvol"
    >
      <Page size="A4" style={styles.page}>
        <Header fecha={fecha} medico={medico} />

        <Text style={certStyles.tituloCert}>{TITULOS[tipo]}</Text>
        <Text style={certStyles.subtituloCert}>{medico.lugar}, Buenos Aires</Text>

        {tipo !== 'reposo_laboral' && (
          <Text style={certStyles.cuerpoLegal}>{intro}</Text>
        )}

        {textoDictado && (
          <Text style={[certStyles.cuerpoLegal, { marginTop: tipo === 'reposo_laboral' ? 0 : 16 }]}>
            {textoDictado}
          </Text>
        )}

        <Text style={[certStyles.cuerpoLegal, { marginTop: 16 }]}>
          El presente certificado se extiende a solicitud del/la interesado/a para los fines que estime conveniente.
        </Text>

        <View style={certStyles.bloqueSello}>
          <View>
            <Text style={certStyles.lugarFecha}>
              {medico.lugar}, {fecha}
            </Text>
          </View>
          <Firma medico={medico} />
        </View>

        <Footer medico={medico} />
      </Page>
    </Document>
  )
}
