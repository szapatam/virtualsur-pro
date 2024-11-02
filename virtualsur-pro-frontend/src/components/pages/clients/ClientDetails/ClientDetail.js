// src/pages/clients/ClientDetail/ClientDetail.js
import React, { useState } from 'react';
import './ClientDetail.css';
import { useNavigate } from 'react-router-dom';

function ClientDetail() {
  const navigate = useNavigate();

  const [clientDetailData, setClientDetailData] = useState({
    name: 'Ejemplo de Nombre',
    email: 'test@ejemplo.com',
    address: 'Calle test #123',
    rut: '12345678-9',
    phone: '111222333',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientDetailData({ ...clientDetailData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cambios Guardados:', clientDetailData);
  };

  const handleDeleteClient = () => {
    console.log('Cliente Eliminado:', clientDetailData.name);
    navigate('/clientes');
  };

  return (
    <div className="client-detail-container">
      <div className="client-detail-header">
        <h2>Detalle Cliente</h2>
      </div>
      <div className="client-search">
        <label htmlFor="clientSearch">Seleccionar Cliente:</label>
        <input type="text" id="clientSearch" placeholder="Nombre de cliente" />
        <button className="search-button">Buscar</button>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Clientes</legend>
          <div className="form-group">
            <label htmlFor="name">Nombre Cliente:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={clientDetailData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={clientDetailData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Dirección:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={clientDetailData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rut">RUT cliente:</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={clientDetailData.rut}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={clientDetailData.phone}
              onChange={handleInputChange}
            />
          </div>
        </fieldset>
        <button type="submit" className="save-button">Guardar Cambios</button>
        <button type="button" className="delete-button" onClick={handleDeleteClient}>Eliminar Cliente</button>
      </form>
      <div className="contracts-section">
        <fieldset>
          <legend>Contratos</legend>
          <table className="contracts-table">
            <thead>
              <tr>
                <th>Encabezado A</th>
                <th>Encabezado B</th>
                <th>Encabezado C</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Celda A</td>
                <td>Celda B</td>
                <td>Celda C</td>
                <td><button className="view-contract-button">Ver Contrato</button></td>
              </tr>
              {/* Aquí irían más filas de contratos asociados */}
            </tbody>
          </table>
        </fieldset>
      </div>
    </div>
  );
}

export default ClientDetail;
