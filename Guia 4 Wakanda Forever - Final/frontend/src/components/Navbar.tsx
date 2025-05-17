import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
 
function Navbar() {
  const { logout, user } = useAuth();
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 px-4">
      <div className="container-fluid">
        <span className="navbar-brand">Wakanda Salud</span>
       
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
 
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pacientes">Pacientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/medicos">Médicos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/citas">Citas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notificaciones">Notificaciones</Link>
            </li>
          </ul>
 
          {/* Seccion de usuario y logout */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {user && (
              <>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Perfil"
                    className="navbar-user-image"
                  />
                )}
                <span className="navbar-user-name text-light">
                  {user.name}
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
 
export default Navbar;