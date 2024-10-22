// src/components/layout/layout.js
import React, { useState} from 'react';
import Sidebar from '../sidebar/Sidebar';
import Topbar from '../topbar/Topbar';
import './layout.css';

function Layout({ children }) {

  //Crea estado de barra lateral en True
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  //Función para cambiar el estado de la barra
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  }

  //Se pasa función toggleSidebar a Topbar.
  return (
    <div className="layout">
    
      <Topbar onMenuClick={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible}/>
      <div className={`main-content ${isSidebarVisible ? '' : 'full-width'}`}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
