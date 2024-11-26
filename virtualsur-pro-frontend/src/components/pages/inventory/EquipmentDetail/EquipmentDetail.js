import React, { useState, useEffect } from 'react';
import './EquipmentDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EquipmentDetail() {
  const navigate = useNavigate();

  const { equipmentId } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchEquipmentDetails = async () => {
          try {
              const response = await axios.get(`http://127.0.0.1:5000/equipment/${equipmentId}`);
              setEquipment(response.data);
          } catch (err) {
              setError('Hubo un error al obtener los detalles del equipo');
          } finally {
              setLoading(false);
          }
      };

      fetchEquipmentDetails();
  }, [equipmentId]);

  if (loading) {
    return <div>Cargando detalles del equipo...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentDetail;
