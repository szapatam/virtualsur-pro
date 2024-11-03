// src/pages/staff/StaffCreate/StaffCreate.js
import React from 'react';
import './StaffCreate.css';
import { useNavigate } from 'react-router-dom';


function StaffCreate() {

    const navigate = useNavigate();

  return (
    <div className="staff-create-container">
      <div className="staff-create-header"> {/* CAMBIO!! */}
        <h1>Ingresar Personal</h1>
        <button className="back-to-list-button" onClick={() => navigate('/personal')} >Volver al Listado</button> {/* Botón para volver al listado */}
      </div>
      
      <form className="staff-create-form">
      <fieldset>
        <legend>Personal</legend>
        <div className="form-group">
          <label htmlFor="name">Nombre Personal:</label>
          <input type="text" id="name" placeholder="Ejemplo de Nombre" />

          <label htmlFor="rut">RUT Personal:</label>
          <input type="text" id="rut" placeholder="12345678-9" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo:</label>
          <input type="email" id="email" placeholder="test@ejemplo.com" />

          <label htmlFor="phone">Teléfono:</label>
          <input type="text" id="phone" placeholder="111222333" />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <input type="text" id="address" placeholder="Calle test #123" />

          <label htmlFor="role">Rol:</label>
          <select id="role">
            <option value="chofer">Chofer</option>
            <option value="carguero">Carguero</option>
            <option value="visualizador">Visualizador</option>
          </select>
        </div>
        </fieldset>
        <div className='save-button-container'>
            <button type="submit" className="save-button">Guardar Cambios</button>
        </div> 
      </form>
    </div>
  );
}

export default StaffCreate;
