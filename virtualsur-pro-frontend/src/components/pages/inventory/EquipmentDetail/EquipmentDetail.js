import React, { useState } from 'react';
import './EquipmentDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function EquipmentDetail() {
  const navigate = useNavigate();  

  const [equipment] = useState({
    id: 'EQ001',
    name: 'Pantalla Samsung 2x1 mts',
    category: 'Pantallas LEDs',
    subcategory: 'Pantallas LEDs 2x1',
    status: 'Disponible',
  });
  const [contracts] = useState([
    { id: 'C001', name: 'Contrato A', detail: 'Detalles del contrato A' },
    { id: 'C002', name: 'Contrato B', detail: 'Detalles del contrato B' },
    { id: 'C003', name: 'Contrato C', detail: 'Detalles del contrato C' },
  ]);
  const [setSelectedContract] = useState(null);

  const handleContractClick = (contract) => {
    setSelectedContract(contract);
  };

  return (
    <div className="equipment-detail-container">
      <div className="equipment-detail-header">
        <h2>Detalle Equipamiento</h2>
        <button className='back-to-list-button' onClick={() => navigate('/InventoryList')}>Volver al listado</button>
      </div>

      <div className="equipment-detail-search">
        <label htmlFor="search">Seleccionar Equipo:</label>
        <div className="search-input-container">
          <input type="text" id="search" value={equipment.id} readOnly />
          <button className='search-button'>Buscar</button>
        </div>
      </div>

      <div className="equipment-detail-info">
        <div className="equipment-section">
        <form>
          <fieldset>
            <legend>Datos del equipamiento</legend>
          <div className="equipment-field">
            <label>Nombre Equipo:</label>
            <input type="text" value={equipment.name} readOnly />
          </div>
          <div className="equipment-field">
            <label>Categoría:</label>
            <input type="text" value={equipment.category} readOnly />
          </div>
          <div className="equipment-field">
            <label>Sub categoría:</label>
            <input type="text" value={equipment.subcategory} readOnly />
          </div>
          <div className="equipment-field">
            <label>Estado:</label>
            <input type="text" value={equipment.status} readOnly />
          </div>
          </fieldset>
          <button className="save-button">Guardar Cambios</button>
          <button className="delete-button">Eliminar Equpamiento</button>
          </form>
        </div>

        
      </div>

      <div className="contracts-section">
        <h2>Contratos</h2>
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
            {contracts.map(contract => (
              <tr key={contract.id} onClick={() => handleContractClick(contract)}>
                <td>{contract.id}</td>
                <td>{contract.name}</td>
                <td>{contract.detail}</td>
                <td>
                  <button className="docs-button">Ver Contrato</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentDetail;
