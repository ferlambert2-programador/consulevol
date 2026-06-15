import { Document, Page, Text, View } from '@react-pdf/renderer'
import { Header, Footer, SeccionPaciente, Firma, styles, MEDICO_DEFAULT } from './plantilla'
import type { MedicoData } from './plantilla'
import type { Paciente, Consulta, Evolucion } from '@/lib/types'

interface Props {
  paciente: Paciente
  consulta: Consulta
  evolucion: Evolucion
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

function formatFechaLarga(iso: string): string {
  const [y, m, d] = iso.split('-')
  const fecha = new Date(Number(y), Number(m) - 1, Number(d))
  return fecha.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function PDFConsulta({ paciente, consulta, evolucion, medico = MEDICO_DEFAULT }: Props) {
  const fechaDisplay = formatFechaLarga(consulta.fecha)
  const edad = calcularEdad(paciente.fecha_nacimiento)

  return (
    <Document
      title={`Evolución — ${paciente.apellido} ${paciente.nombre} — ${consulta.fecha}`}
      author="ConsulEvol"
    >
      <Page size="A4" style={styles.page}>
        <Header fecha={fechaDisplay} medico={medico} />

        <SeccionPaciente
          nombre={paciente.nombre}
          apellido={paciente.apellido}
          fechaNacimiento={paciente.fecha_nacimiento}
          obraSocial={paciente.obra_social}
          nroAfiliado={paciente.nro_afiliado}
          alergias={paciente.alergias}
          edad={edad}
        />

        <Text style={styles.tituloSeccion}>
          {consulta.motivo ? `Consulta: ${consulta.motivo}` : 'Evolución clínica'}
        </Text>

        <Text style={styles.cuerpo}>{evolucion.texto_redactado}</Text>

        {paciente.antecedentes && (
          <>
            <View style={styles.separador} />
            <Text style={styles.tituloSeccion}>Antecedentes</Text>
            <Text style={styles.cuerpo}>{paciente.antecedentes}</Text>
          </>
        )}

        {paciente.medicacion_habitual && (
          <>
            <Text style={styles.tituloSeccion}>Medicación habitual</Text>
            <Text style={styles.cuerpo}>{paciente.medicacion_habitual}</Text>
          </>
        )}

        <Firma medico={medico} />
        <Footer medico={medico} />
      </Page>
    </Document>
  )
}
