import { usePacientes } from '../hooks/usePacientes';
import { useMedicos } from '../hooks/useMedicos';
import { useCitas } from '../hooks/useCitas';
import { useNotificaciones } from '../hooks/useNotificaciones';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import type { Paciente, Medico, Cita, Notificacion } from '../types';

function Dashboard() {
  const { data: pacientes = [], loading: loadingPacientes } = usePacientes() as { data: Paciente[], loading: boolean };
  const { data: medicos = [], loading: loadingMedicos } = useMedicos() as { data: Medico[], loading: boolean };
  const { data: citas = [], loading: loadingCitas } = useCitas() as { data: Cita[], loading: boolean };
  const { data: notificaciones = [], loading: loadingNotificaciones } = useNotificaciones() as { data: Notificacion[], loading: boolean };

  const getNombrePaciente = (id: string) =>
    pacientes.find((p) => p.id_paciente === id)?.nombre || id;

  const isLoading = loadingPacientes || loadingMedicos || loadingCitas || loadingNotificaciones;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Navbar />
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Sistema Médico - Wakanda Salud</h1>
        </div>
      </header>

      <main style={styles.mainContent}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Cargando datos del dashboard...</p>
          </div>
        ) : (
          <>
            {/* Estadisticas */}
            <div style={styles.grid}>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Pacientes</h3>
                  <div style={{ ...styles.cardIcon, backgroundColor: '#00c85333' }}>❤</div>
                </div>
                <p style={styles.cardNumber}>{pacientes.length}</p>
                <Link to="/pacientes" style={styles.viewAllLink}>Ver todos →</Link>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Médicos</h3>
                  <div style={{ ...styles.cardIcon, backgroundColor: '#ffd70033' }}>🩺</div>
                </div>
                <p style={styles.cardNumber}>{medicos.length}</p>
                <Link to="/medicos" style={styles.viewAllLink}>Ver todos →</Link>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Citas</h3>
                  <div style={{ ...styles.cardIcon, backgroundColor: '#2196f333' }}>📅</div>
                </div>
                <p style={styles.cardNumber}>{citas.length}</p>
                <Link to="/citas" style={styles.viewAllLink}>Ver todos →</Link>
              </div>

              {/* Nueva tarjeta de Notificaciones */}
              <div style={styles.card}>
              <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Notificaciones</h3>
              <div style={{ ...styles.cardIcon, backgroundColor: '#2a2a7233' }}>🔔</div>
              </div>
              <p style={styles.cardNumber}>{notificaciones.length}</p>
              <Link to="/notificaciones" style={styles.viewAllLink}>Ver todos →</Link>
              </div>
            </div>

            {/* Actividad Reciente */}
            <div style={styles.sectionTitle}>Actividad Reciente</div>
            <div style={styles.grid}>

              <div style={styles.activityCard}>
                <div style={styles.activityHeader}>
                  <h3 style={styles.activityTitle}>❤ Últimos Pacientes</h3>
                  <Link to="/pacientes" style={styles.viewAllSmall}>Ver todos</Link>
                </div>
                <div style={styles.activityList}>
                  {pacientes.slice(0, 5).map((p) => (
                    <div key={p.id_paciente} style={styles.activityItem}>
                      <div style={styles.avatarSmall}>
                        {p.nombre.charAt(0)}
                      </div>
                      <div style={styles.activityInfo}>
                        <div style={styles.activityName}>{p.nombre}</div>
                        <div style={styles.activityMeta}>{p.telefono}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.activityCard}>
                <div style={styles.activityHeader}>
                  <h3 style={styles.activityTitle}>🩺 Últimos Médicos</h3>
                  <Link to="/medicos" style={styles.viewAllSmall}>Ver todos</Link>
                </div>
                <div style={styles.activityList}>
                  {medicos.slice(0, 5).map((m) => (
                    <div key={m.id_medico} style={styles.activityItem}>
                      <div style={styles.avatarSmall}>
                        {m.nombre.charAt(0)}
                      </div>
                      <div style={styles.activityInfo}>
                        <div style={styles.activityName}>{m.nombre}</div>
                        <div style={styles.activityMeta}>{m.correo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.activityCard}>
                <div style={styles.activityHeader}>
                  <h3 style={styles.activityTitle}>📅 Últimas Citas</h3>
                  <Link to="/citas" style={styles.viewAllSmall}>Ver todos</Link>
                </div>
                <div style={styles.activityList}>
                  {citas.slice(0, 5).map((c) => (
                    <div key={c.id_cita} style={styles.activityItem}>
                      <div style={styles.avatarSmall}>
                        {getNombrePaciente(c.paciente_id).charAt(0)}
                      </div>
                      <div style={styles.activityInfo}>
                        <div style={styles.activityName}>{getNombrePaciente(c.paciente_id)}</div>
                        <div style={styles.activityMeta}>
                          {new Date(c.fecha_hora).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(c.estado) + '33',
                        color: getStatusColor(c.estado)
                      }}>
                        {c.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.activityCard}>
                <div style={styles.activityHeader}>
                  <h3 style={styles.activityTitle}>🔔 Últimas Notificaciones</h3>
                  <Link to="/notificaciones" style={styles.viewAllSmall}>Ver todos</Link>
                </div>
                <div style={styles.activityList}>
                  {notificaciones.slice(0, 5).map((n) => (
                    <div key={n.id_notificacion} style={styles.activityItem}>
                      <div style={{
                        ...styles.notificationIcon,
                        backgroundColor: getStatusColor(n.estado) + '33',
                        color: getStatusColor(n.estado)
                      }}>
                        {n.tipo === 'Recordatorio' && '⏰'}
                        {n.tipo === 'Alerta' && '🚨'}
                        {n.tipo === 'Actualización' && '🔄'}
                      </div>
                      <div style={styles.activityInfo}>
                        <div style={styles.activityName}>{n.tipo}</div>
                        <div style={styles.activityMeta}>
                          {new Date(n.fecha_envio).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </div>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(n.estado) + '33',
                        color: getStatusColor(n.estado)
                      }}>
                        {n.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const getStatusColor = (status: string) => {
  switch(status.toLowerCase()) {
    case 'pendiente': return '#FFD700';
    case 'completada': return '#00C853';
    case 'cancelada': return '#FF1744';
    case 'leída': return '#00C853';
    case 'urgente': return '#FF1744';
    default: return '#2a2a72';
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    backgroundColor: '#f8f9fa'
  },
  header: {
    background: '#2a2a72',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    paddingBottom: '1rem'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem'
  },
  title: {
    color: '#fff',
    fontSize: '1.8rem',
    margin: '1rem 0',
    fontWeight: '600'
  },
  userPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userName: {
    color: '#fff',
    fontWeight: '500'
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    background: '#fff',
    color: '#2a2a72',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '600',
    ':hover': {
      opacity: 0.9
    }
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '0 2rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    padding: '3rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2a2a72',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#666',
    fontWeight: '500'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2a2a72',
    margin: '2rem 0 1rem 0',
    fontWeight: '600'
  },
  card: {
    background: '#fff',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  cardTitle: {
    margin: 0,
    color: '#2a2a72',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  cardNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2a2a72',
    margin: '1rem 0'
  },
  viewAllLink: {
    color: '#2a2a72',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  activityCard: {
    background: '#fff',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
    }
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  activityTitle: {
    margin: 0,
    color: '#2a2a72',
    fontSize: '1.2rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  viewAllSmall: {
    color: '#2a2a72',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.85rem',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  avatarSmall: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#2a2a72',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    flexShrink: 0
  },
  notificationIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0
  },
  activityInfo: {
    flex: 1,
    minWidth: 0
  },
  activityName: {
    fontWeight: '600',
    color: '#2a2a72',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  activityMeta: {
    color: '#666',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  userImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover' as const
  }
};

export default Dashboard;