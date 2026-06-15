import { Text, View, StyleSheet } from '@react-pdf/renderer'

export interface MedicoData {
  nombre: string
  matricula: string
  lugar: string
  direccion: string
  telefono_consultorio?: string
  telefono_secretaria?: string
}

export const MEDICO_DEFAULT: MedicoData = {
  nombre: 'Dr. Fernando Lambert',
  matricula: 'MP 115.740',
  lugar: 'Trenque Lauquen',
  direccion: 'Trenque Lauquen, Buenos Aires',
  telefono_consultorio: '',
}

// Keep for backward compat
export const MEDICO = MEDICO_DEFAULT

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 52,
    color: '#1e293b',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f766e',
    paddingBottom: 12,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nombreMedico: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0f766e',
  },
  subtitleMedico: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  fechaDoc: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  lugarDoc: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 2,
  },
  seccionPaciente: {
    backgroundColor: '#f0fdfa',
    borderRadius: 4,
    padding: 12,
    marginBottom: 18,
  },
  nombrePaciente: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#134e4a',
  },
  datosPaciente: {
    fontSize: 9,
    color: '#475569',
    marginTop: 3,
  },
  tituloSeccion: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 14,
  },
  cuerpo: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#1e293b',
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 52,
    right: 52,
    borderTopWidth: 1,
    borderTopColor: '#0f766e',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerNombre: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f766e',
  },
  footerSub: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 1,
  },
  footerDerecha: {
    textAlign: 'right',
  },
  firmaBloque: {
    marginTop: 40,
    alignItems: 'flex-end',
  },
  firmaLinea: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    width: 180,
    marginBottom: 4,
  },
  firmaNombre: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  firmaMatricula: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'right',
  },
  alertaAlergia: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    padding: 8,
    marginBottom: 12,
    borderRadius: 2,
  },
  alertaAlergiaTexto: {
    fontSize: 9,
    color: '#991b1b',
  },
})

export { styles }

interface HeaderProps {
  fecha: string
  lugar?: string
  medico?: MedicoData
}

export function Header({ fecha, lugar, medico = MEDICO_DEFAULT }: HeaderProps) {
  const lugarDisplay = lugar ?? medico.lugar
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.nombreMedico}>{medico.nombre}</Text>
          <Text style={styles.subtitleMedico}>{medico.matricula}</Text>
          {medico.direccion && <Text style={styles.subtitleMedico}>{medico.direccion}</Text>}
        </View>
        <View>
          <Text style={styles.fechaDoc}>{fecha}</Text>
          <Text style={styles.lugarDoc}>{lugarDisplay}</Text>
        </View>
      </View>
    </View>
  )
}

export function Footer({ medico = MEDICO_DEFAULT }: { medico?: MedicoData }) {
  return (
    <View style={styles.footer} fixed>
      <View>
        <Text style={styles.footerNombre}>{medico.nombre} — {medico.matricula}</Text>
        {medico.direccion && <Text style={styles.footerSub}>{medico.direccion}</Text>}
      </View>
      <View style={styles.footerDerecha}>
        {medico.telefono_consultorio && <Text style={styles.footerSub}>Tel: {medico.telefono_consultorio}</Text>}
        {medico.telefono_secretaria && <Text style={styles.footerSub}>Sec: {medico.telefono_secretaria}</Text>}
      </View>
    </View>
  )
}

interface SeccionPacienteProps {
  nombre: string
  apellido: string
  fechaNacimiento?: string | null
  obraSocial?: string | null
  nroAfiliado?: string | null
  alergias?: string | null
  edad?: string
}

export function SeccionPaciente({ nombre, apellido, obraSocial, nroAfiliado, alergias, edad }: SeccionPacienteProps) {
  const datosExtra = [
    edad && `Edad: ${edad}`,
    obraSocial && `Cobertura: ${obraSocial}`,
    nroAfiliado && `Nro. afiliado: ${nroAfiliado}`,
  ].filter(Boolean).join('  ·  ')

  return (
    <View>
      {alergias && (
        <View style={styles.alertaAlergia}>
          <Text style={styles.alertaAlergiaTexto}>⚠ ALERGIAS: {alergias}</Text>
        </View>
      )}
      <View style={styles.seccionPaciente}>
        <Text style={styles.nombrePaciente}>{apellido}, {nombre}</Text>
        {datosExtra ? <Text style={styles.datosPaciente}>{datosExtra}</Text> : null}
      </View>
    </View>
  )
}

export function Firma({ medico = MEDICO_DEFAULT }: { medico?: MedicoData }) {
  return (
    <View style={styles.firmaBloque}>
      <View style={styles.firmaLinea} />
      <Text style={styles.firmaNombre}>{medico.nombre}</Text>
      <Text style={styles.firmaMatricula}>{medico.matricula}</Text>
    </View>
  )
}
