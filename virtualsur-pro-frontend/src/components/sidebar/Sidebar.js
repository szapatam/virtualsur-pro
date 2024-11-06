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
              <li><a href="#inventory-list">Listado de Inventario</a></li>
              <li><a href="#add-equipment">Ingresar Equipamiento</a></li>
              <li><a href="#remove-equipment">Eliminar Equipamiento</a></li>
            </ul>
          </li>
          <li>
            <a href="#contracts">
              <FontAwesomeIcon icon={faFileContract} className="sidebar-icon" />
              Gestión de Contratos
            </a>
            <ul>
              <li><a href="#list-contracts">Listado de Contratos</a></li>
              <li><a href="#add-contract">Ingresar Contrato</a></li>
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
              <li><a href="#contract-report">Reporte de Contratos</a></li>
              <li><a href="#inventory-history">Histórico de Inventario</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
