import React, { useState } from 'react';
import './NewEquipment.css';
import { useNavigate } from 'react-router-dom';

function NewEquipment() {
  const [equipmentName, setEquipmentName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState('');
  const [quantity, setQuantity] = useState('');
  const [technicalCode, setTechnicalCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // #CAMBIOS!! -> Aquí iría la lógica para enviar los datos al backend o almacenarlos temporalmente
    console.log({ equipmentName, category, subCategory, status, quantity, technicalCode });
  };
  
  const navigate = useNavigate();
  return (
    <div className="new-equipment-container">
      <div className="new-equipment-header">
        <h1>Ingresar Equipamiento (Lote)</h1>
        <button className="back-to-list-button" onClick={() => navigate('/InventoryList')}>
            Volver al Listado
        </button>
        </div>  
      <form onSubmit={handleSubmit} className="new-equipment-form">
        <fieldset>
        <legend>Nuevo Equipamiento</legend>
        <label>
          Nombre Equipo:
          <input 
            type="text" 
            value={equipmentName} 
            onChange={(e) => setEquipmentName(e.target.value)} 
            placeholder="Pantalla Samsung 2x1 mts" 
          />
        </label>

        <label>
          Categoría:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Categoría</option>
            <option value="Pantallas">Pantallas</option>
            <option value="Torres">Torres</option>
            <option value="Cajas de Transporte">Cajas de Transporte</option>
            <option value="Otros">Otros</option>
          </select>
        </label>

        <label>
          Sub categoría:
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
            <option value="">Sub categoría</option>
            <option value="Pantalla 2x2">Pantalla 2x2</option>
            <option value="Pantalla 4x4">Pantalla 4x4</option>
            <option value="Caja Pequeña">Caja Pequeña</option>
            <option value="Caja Grande">Caja Grande</option>
          </select>
        </label>

        <label>
          Estado:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Estado</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Usado">Usado</option>
            <option value="En Reparación">En Reparación</option>
          </select>
        </label>

        <label>
          Cantidad:
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            placeholder="Cantidad" 
          />
        </label>

        <label>
          Código Técnico:
          <input 
            type="text" 
            value={technicalCode} 
            onChange={(e) => setTechnicalCode(e.target.value)} 
            placeholder="Código Técnico" 
          />
        </label>
        </fieldset>
        <div className='save-button-container'>
            <button type="submit" className="submit-button">Ingresar</button>
        </div>

      </form>
    </div>
  );
}

export default NewEquipment;
