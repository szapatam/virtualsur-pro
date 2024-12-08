// src/pages/staff/StaffList/StaffList.js
import React, { useState, useEffect } from 'react';
import './StaffList.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

function StaffList() {
  const navigate = useNavigate();

  const handleNewStaffClick = () => {
    navigate('/personal/nuevo');
  };

  const handleViewStaffClick = (staffId) => {
    console.log('Client ID:', staffId);
    if (staffId) {
      navigate(`/personal/${staffId}`);
    } else {
      console.error('Cliente ID is undefined')
    }
  }

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener los personales del backend
  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/personal');
      setStaffs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Hubo un error al obtener la lista de clientes');
      setLoading(false);
    }
  };

  // Llamamos a fetchClients al montar el componente
  useEffect(() => {
    fetchStaff();
  }, []);

    //Eliminar personal
    const handleDeleteStaff = (staffId) => {
      //solicitud DELETE al backend
      axios.delete(`http://127.0.0.1:5000/personal/${staffId}`)
      .then(response => {
        //Eliminar personal del estado para actualizar la lista
        setStaffs(staffs.filter(staff => staff.staff_id !== staffId));
        alert('Personal Eliminado con exito');
      })
      .catch(error =>{
        console.error('Error al eliminar Personal', error);
        alert('Hubo un error al eliminar Personal')
      })
      
    }



  return (
    <div className="staff-list-container">
      <div className="staff-header">
        <h1>Listado Personal</h1>
        {error && <p className="error-message">{error}</p>}
        {loading && <p>Cargando...</p>}
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
            <th>Nombre</th>
            <th>RUT</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.staff_id}>
              <td>{staff.staff_name}</td>
              <td>{staff.staff_rut}</td>
              <td>{staff.staff_email}</td>
              <td>{staff.staff_phone}</td>
              <td>{staff.staff_address}</td>
              <td>{staff.role}</td>
              <td>{staff.status}</td>
              <td>
                <button onClick={() => handleViewStaffClick(staff.staff_id)} className="action-button edit">
                  <FontAwesomeIcon icon={faEdit} /> Ver/Editar
                </button>
                <button className="action-button delete" onClick={() => handleDeleteStaff(staff.staff_id)} >
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
