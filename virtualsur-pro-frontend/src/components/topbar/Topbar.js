import React from 'react';
import './Topbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

function Topbar( {onMenuClick} ) {
  const navigate = useNavigate(); // Hook para redirigir

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminamos el token del almacenamiento local
    alert('Sesión cerrada');
    navigate('/login'); // Redirigimos al login
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <FontAwesomeIcon icon={faBars} className="topbar-menu-icon" onClick={onMenuClick} />
        <Link to="/" className="topbar-logo-link">
          <h2 className="topbar-logo">VisualSur Pro</h2>
        </Link>
      </div>
      <div className="topbar-right">
        <p onClick={handleLogout} className='logout-text'>Cerrar Sesión</p>
          <FontAwesomeIcon icon={faUserCircle} className="topbar-user-icon" />
      </div> 
    </div>
  );
}

export default Topbar;
