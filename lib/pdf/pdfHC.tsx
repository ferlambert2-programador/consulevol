import { Document, Page, Text, View } from '@react-pdf/renderer'
import { Header, Footer, SeccionPaciente, Firma, styles, MEDICO_DEFAULT } from './plantilla'
import type { MedicoData } from './plantilla'
import type { Paciente, Consulta, Evolucion } from '@/lib/types'

interface ConsultaConEvolucion extends Consulta {
  evolucion: Evolucion | null
}

interface Props {
  paciente: Paciente
  consultas: ConsultaConEvolucion[]
  resumenIA?: string
  medico?: MedicoData
}

function calcularEdad(fn: string | null): string | undefined {
  if (!fn) return undefined
  const hoy = new Date(), nac = new Date(fn)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return `${edad} años`
}

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split('T')[0].split('-')
  return `${d}/${m}/${y}`
}

function formatFechaHoy(): string {
  return new Date().toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function PDFHC({ paciente, consultas, resumenIA, medico = MEDICO_DEFAULT }: Props) {
  const edad = calcularEdad(paciente.fecha_nacimiento)
  const fechaEmision = formatFechaHoy()
  const consultasOrdenadas = [...consultas].sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <Document
      title={`Historia Clínica — ${paciente.apellido} ${paciente.nombre}`}
      author="ConsulEvol"
    >
      <Page size="A4" style={styles.page}>
        <Header fecha={`Emitido: ${fechaEmision}`} medico={medico} />

        <SeccionPaciente
          nombre={paciente.nombre}
          apellido={paciente.apellido}
          fechaNacimiento={paciente.fecha_nacimiento}
          obraSocial={paciente.obra_social}
          nroAfiliado={paciente.nro_afiliado}
          alergias={paciente.alergias}
          edad={edad}
        />

        {resumenIA && (
          <>
            <Text style={styles.tituloSeccion}>Resumen de historia clínica</Text>
            <Text style={styles.cuerpo}>{resumenIA}</Text>
            <View style={styles.separador} />
          </>
        )}

        {(paciente.antecedentes || paciente.medicacion_habitual) && (
          <>
            <Text style={styles.tituloSeccion}>Antecedentes y medicación habitual</Text>
            {paciente.antecedentes && <Text style={styles.cuerpo}>{paciente.antecedentes}</Text>}
            {paciente.medicacion_habitual && (
              <Text style={[styles.cuerpo, { marginTop: 4 }]}>
                Medicación: {paciente.medicacion_habitual}
              </Text>
            )}
            <View style={styles.separador} />
          </>
        )}

        <Text style={styles.tituloSeccion}>
          Consultas registradas ({consultasOrdenadas.length})
        </Text>

        {consultasOrdenadas.map((c, idx) => (
          <View key={c.id} style={{ marginBottom: 14 }} wrap={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={{
                width: 20, height: 20,
                backgroundColor: '#f0fdfa',
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                <Text style={{ fontSize: 8, color: '#0f766e', fontFamily: 'Helvetica-Bold' }}>
                  {idx + 1}
                </Text>
              </View>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f766e' }}>
                {formatFecha(c.fecha)}{c.motivo ? `  ·  ${c.motivo}` : ''}
              </Text>
            </View>
            {c.evolucion ? (
              <Text style={[styles.cuerpo, { paddingLeft: 28 }]}>
                {c.evolucion.texto_redactado}
              </Text>
            ) : (
              <Text style={[styles.cuerpo, { paddingLeft: 28, color: '#94a3b8' }]}>
                Sin evolución registrada
              </Text>
            )}
          </View>
        ))}

        <Firma medico={medico} />
        <Footer medico={medico} />
      </Page>
    </Document>
  )
}
