import { useState } from 'react';
import { useNotificaciones } from '../hooks/useNotificaciones';
import Navbar from '../components/Navbar';
 
function Notificaciones() {
  const { data: notificaciones, loading } = useNotificaciones();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;
 
  const filtered = notificaciones.filter((n: any) =>
    n.tipo.toLowerCase().includes(search.toLowerCase()) ||
    n.estado.toLowerCase().includes(search.toLowerCase())
  );
 
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
 
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pendiente': return '#FFD700';
      case 'leída': return '#00C853';
      case 'urgente': return '#FF1744';
      default: return '#2a2a72';
    }
  };
 
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Navbar />
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Notificaciones - Wakanda Salud</h1>
         
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Buscar por tipo o estado..."
              style={styles.searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </header>
 
      <main style={styles.mainContent}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Cargando notificaciones...</p>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {paginated.map((n: any) => (
                <div key={n.id_notificacion} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.iconContainer}>
                      {n.tipo === 'Recordatorio' && '⏰'}
                      {n.tipo === 'Alerta' && '🚨'}
                      {n.tipo === 'Actualización' && '🔄'}
                    </div>
                    <div style={styles.cardInfo}>
                      <h3 style={styles.cardTitle}>{n.tipo}</h3>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(n.estado) + '33',
                        color: getStatusColor(n.estado)
                      }}>
                        {n.estado}
                      </span>
                    </div>
                  </div>
                 
                  <p style={styles.content}>
                    {n.contenido.length > 120 ?
                     n.contenido.slice(0, 120) + '...' :
                     n.contenido}
                  </p>
                 
                  <div style={styles.footer}>
                    <span style={styles.date}>
                      {new Date(n.fecha_envio).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
 
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.paginationButton,
                  ...(page === 1 && styles.disabledButton)
                }}
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                ← Anterior
              </button>
             
              <div style={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    style={{
                      ...styles.pageButton,
                      ...(page === i + 1 && styles.activePage)
                    }}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
             
              <button
                style={{
                  ...styles.paginationButton,
                  ...(page === totalPages && styles.disabledButton)
                }}
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
 
const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    background: '#2a2a72',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    paddingBottom: '1rem'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  title: {
    color: '#fff',
    fontSize: '1.8rem',
    margin: '1rem 0 2rem 0'
  },
  searchContainer: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    ':focus': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '0 2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0'
  },
  card: {
    background: '#fff',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-3px)'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem'
  },
  iconContainer: {
    fontSize: '1.8rem',
    padding: '0.5rem'
  },
  cardInfo: {
    flex: 1
  },
  cardTitle: {
    margin: 0,
    color: '#2a2a72',
    fontSize: '1.2rem'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block'
  },
  content: {
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    margin: '1rem 0'
  },
  footer: {
    borderTop: '1px solid #eee',
    paddingTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    color: '#888',
    fontSize: '0.85rem'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '3rem',
    flexWrap: 'wrap' as const
  },
  paginationButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    background: '#2a2a72',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '600',
    ':hover': {
      opacity: 0.9
    }
  },
  disabledButton: {
    background: '#e0e0e0 !important',
    cursor: 'not-allowed',
    color: '#666 !important'
  },
  pageNumbers: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  pageButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #e0e0e0',
    background: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500'
  },
  activePage: {
    background: '#2a2a72',
    color: '#fff',
    borderColor: '#2a2a72'
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
  }
};
 
export default Notificaciones;