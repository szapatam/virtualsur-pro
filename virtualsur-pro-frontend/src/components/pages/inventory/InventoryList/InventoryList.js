// src/pages/InventoryList/InventoryList.js
import React, { useState } from 'react';
import './InventoryList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function InventoryList() {

  const navigate = useNavigate();

  const handleAddEquipmentClick = () => {
    navigate('/NewEquipment');
  };

  const handleViewEquipmentClick = (equipmentId) =>{
    navigate(`/equipment/${equipmentId}`)
  }

  // Datos estáticos de ejemplo para el inventario
  const [inventoryItems] = useState([
    { id: 'E001', name: 'Equipo A', detail: 'Detalles del equipo A' },
    { id: 'E002', name: 'Equipo B', detail: 'Detalles del equipo B' },
    { id: 'E003', name: 'Equipo C', detail: 'Detalles del equipo C' },
    { id: 'E004', name: 'Equipo D', detail: 'Detalles del equipo D' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(inventoryItems);

  // Manejar el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = inventoryItems.filter(item =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      item.id.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="inventory-list-container">
      <div className="inventory-list-header">
        <h1>Listado de Inventario</h1>
        <button className="new-equipment-button"onClick={handleAddEquipmentClick}>Nuevo Equipamiento</button> {/* #CAMBIOS!! -> Botón para agregar nuevo equipamiento */}
      </div>

      <div className="inventory-list-filters">
        <label htmlFor="search">Filtros:</label>
        <div className="search-input-container">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
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
              <th>Encabezado A</th>
              <th>Encabezado B</th>
              <th>Encabezado C</th>
              <th>Encabezado D</th>
            </tr>
          </thead>
          <tbody>
            {/* Mostrar los elementos filtrados del inventario */}
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.detail}</td>
                <td>
                  <button className="action-button view" onClick={() => handleViewEquipmentClick(item.id) }>Ver/Editar</button>
                  <button className="action-button delete">Eliminar</button>
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
