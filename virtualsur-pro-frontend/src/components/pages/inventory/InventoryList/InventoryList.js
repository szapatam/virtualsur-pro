// src/pages/InventoryList/InventoryList.js
import React, { useState, useEffect } from 'react';
import './InventoryList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';

function InventoryList() {

  const navigate = useNavigate();
  // Estado para almacenar el listado de equipos
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  const handleAddEquipmentClick = () => {
    navigate('/equipment');
  };

  const handleViewEquipmentClick = async (equipmentId) => {
    console.log('Equipment ID:', equipmentId);
    if (equipmentId) {
      navigate(`/equipment/${equipmentId}`);
    } else {
      console.error('Equipment ID is undefined')
    }
  }
  
  const fetchEquipos = async () => {
    try {
        const response = await api.get('http://127.0.0.1:5000/equipment');
        setEquipos(response.data);
        setLoading(false);
    } catch (error) {
      setError("Hubo un error al obtener el inventario:", error);
        setLoading(false);
    }
  };

  // Efecto para obtener el listado de equipos al montar el componente
  useEffect(() => {
    fetchEquipos();
    }, []);


     //Eliminar Equipamiento
  const handleDeleteEquipment = (equipmentId) => {
    //solicitud DELETE al backend
    api.delete(`http://127.0.0.1:5000/equipment/${equipmentId}`)
    .then(response => {
      //Eliminar equipamiento del estado para actualizar la lista
      setEquipos(equipos.filter(equipo => equipo.equipment_id !== equipmentId));
      alert('Equipamiento Eliminado con exito');
    })
    .catch(error =>{
      console.error('Error al eliminar equipamiento', error);
      alert('Hubo un error al eliminar equipamiento')
    })
    
  }


  return (
    <div className="inventory-list-container">
      <div className="inventory-list-header">
        <h1>Listado de Inventario</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="error-message">{error}</p>}
        <button className="new-equipment-button"onClick={handleAddEquipmentClick}>Nuevo Equipamiento</button>
      </div>
      <div className="inventory-list-filters">
        <label htmlFor="search">Filtros:</label>
        <div className="search-input-container">
          <input
            type="text"
            id="search"
            placeholder="Código Técnico"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <select className="filter-select">
          <option>Estado</option>
        </select>
        <select className="filter-select">
          <option>Categorías</option>
        </select>
        <select className="filter-select">
          <option>Sub categoría</option>
        </select>
      </div>
      <div className="inventory-list-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código Técnico</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {equipos.map(equipo => (
            <tr key={equipo.equipment_id}>
              <td>{equipo.equipment_name}</td>
              <td>{equipo.tech_code}</td>
              <td>{equipo.category_name}</td>
              <td>{equipo.subcategory_name}</td>
              <td>{equipo.status_equipment}</td>
              <td>
                <button onClick={() => handleViewEquipmentClick(equipo.equipment_id)} className="action-button edit">
                  <FontAwesomeIcon icon={faEdit} /> Ver/Editar
                </button>
                <button className="action-button delete" onClick={() => handleDeleteEquipment(equipo.equipment_id)}>
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;