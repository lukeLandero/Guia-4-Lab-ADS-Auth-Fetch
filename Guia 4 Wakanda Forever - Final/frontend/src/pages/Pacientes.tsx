import { useState } from 'react';
import { usePacientes } from '../hooks/usePacientes';
import Navbar from '../components/Navbar';
 
function Pacientes() {
  const { data: pacientes, loading } = usePacientes();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;
 
  const filtered = pacientes.filter((p: any) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
 
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Navbar />
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Gestión de Pacientes - Wakanda Salud</h1>
         
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Buscar paciente por nombre..."
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
            <p style={styles.loadingText}>Cargando pacientes...</p>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {paginated.map((p: any) => (
                <div key={p.id_paciente} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.avatar}>
                      {p.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.patientInfo}>
                      <h3 style={styles.name}>{p.nombre}</h3>
                      <p style={styles.dui}>DUI: {p.dui}</p>
                    </div>
                  </div>
                 
                  <div style={styles.details}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Teléfono:</span>
                      <span style={styles.detailValue}>{p.telefono}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Correo:</span>
                      <span style={styles.detailValue}>{p.correo}</span>
                    </div>
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
    marginBottom: '1.5rem',
    gap: '1rem'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#009ffd',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  patientInfo: {
    flex: 1
  },
  name: {
    margin: 0,
    color: '#2a2a72',
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  dui: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
  },
  details: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    color: '#666',
    fontSize: '0.9rem'
  },
  detailValue: {
    color: '#2a2a72',
    fontWeight: '600',
    maxWidth: '200px',
    textAlign: 'right' as const
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
 
export default Pacientes;