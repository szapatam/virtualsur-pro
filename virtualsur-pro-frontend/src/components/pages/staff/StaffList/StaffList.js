// src/pages/staff/StaffList/StaffList.js
import React, { useState } from 'react';
import './StaffList.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'

function StaffList() {
  const navigate = useNavigate();

  const [staffData] = useState([
    { id: 1, name: 'Celda A', role: 'Encabezado B', phone: 'Celda C' },
    { id: 2, name: 'Celda A', role: 'Cell B', phone: 'Cell C' },
    // Datos de ejemplo...
  ]);

  const handleNewStaffClick = () => {
    navigate('/personal/nuevo');
  };

  return (
    <div className="staff-list-container">
      <div className="staff-header">
      <h1>Listado Personal</h1>
      <button className="new-staff-button" onClick={handleNewStaffClick}>
      <FontAwesomeIcon icon={faPlus} /> Nuevo Cliente
      </button>
      </div>
      <div className="staff-search">
        <label htmlFor="staffSearch">Buscar Personal:</label>
        <input type="text" id="staffSearch" placeholder="Nombre de Personal" />
        <select className="role-filter">
          <option value="">Roles</option>
          <option value="role1">Role 1</option>
          <option value="role2">Role 2</option>
        </select>
      </div>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Encabezado A</th>
            <th>Encabezado B</th>
            <th>Encabezado C</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {staffData.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.role}</td>
              <td>{staff.phone}</td>
              <td>
              <button className="action-button edit">
                <FontAwesomeIcon icon={faEdit} /> Ver/Editar
              </button>
              <button className="action-button delete">
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffList;
