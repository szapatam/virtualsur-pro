import React from 'react';
import './Topbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Topbar( {onMenuClick} ) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <FontAwesomeIcon icon={faBars} className="topbar-menu-icon" onClick={onMenuClick} />
        <Link to="/" className="topbar-logo-link">
          <h2 className="topbar-logo">VisualSur Pro</h2>
        </Link>
      </div>
      <div className="topbar-right">
        <FontAwesomeIcon icon={faBell} className="topbar-notification-icon" />
          <span>Bienvenido!</span>
          <FontAwesomeIcon icon={faUserCircle} className="topbar-user-icon" />
      </div> 
    </div>
  );
}

export default Topbar;
