import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faFileContract, faUsers, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Sidebar({ isVisible }) {
  return (
    <div className={`sidebar ${isVisible ? '' : 'hidden'}`}>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#inventory">
              <FontAwesomeIcon icon={faBoxesStacked} className="sidebar-icon" />
              Gestión de Inventario
            </a>
            <ul>
              <li><Link to="/InventoryList">Listado de Inventario</Link></li>
              <li><Link to="/NewEquipment">Ingresar Equipamiento</Link></li>
            </ul>
          </li>
          <li>
            <a href="#contracts">
              <FontAwesomeIcon icon={faFileContract} className="sidebar-icon" />
              Gestión de Contratos
            </a>
            <ul>
              <li><Link to="/ContractList">Listado de Contratos</Link></li>
              <li><Link to="/ContractCreate">Ingresar Contrato</Link></li>
            </ul>
          </li>
          <li>
            <a href="#admin">
              <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
              Administración General
            </a>
            <ul>
              <li><Link to="/clientes">Listado de Clientes</Link></li>
              <li><a href="/personal">Listado de Personal</a></li>
            </ul>
          </li>
          <li>
            <a href="#reports">
              <FontAwesomeIcon icon={faFileAlt} className="sidebar-icon" />
              Documentos/Reportes
            </a>
            <ul>
              <li><Link to="/docs/NewDocs" >Generar Documentos</Link></li>
              <li><Link to="/NewReport">Reporte de Contratos</Link></li>
              <li><Link to="/InventoryHistory">Histórico de Inventario</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
