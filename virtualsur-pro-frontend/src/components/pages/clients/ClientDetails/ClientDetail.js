// src/pages/clients/ClientDetail/ClientDetail.js
import React, { useState, useEffect } from 'react';
import './ClientDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../api';

function ClientDetail() {
  const navigate = useNavigate();

  const { clientId } = useParams();
  console.log('Client ID from URL:', clientId);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener los detalles del cliente


  // Llamamos a fetchClientDetails al montar el componente
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:5000/clientes/${clientId}`);
        setClient(response.data);
        setLoading(false);
      } catch (err) {
        setError('Hubo un error al obtener los detalles del cliente');
        setLoading(false);
      }
    }; fetchClientDetails();
  }, [clientId]);


  // Función para guardar los cambios en el cliente
  const handleSaveChanges = async () => {
    try {
      await api.put(`http://127.0.0.1:5000/clientes/${clientId}`, client);
      alert('Cliente actualizado correctamente');
      navigate('/clientes');
    } catch (err) {
      setError('Hubo un error al actualizar el cliente');
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Maneja el cambio de valores en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  return (
    <div className="client-detail-container">
      <div className="client-detail-header">
        <h2>Detalle Cliente</h2>
        <button className='back-to-list-button' onClick={() => navigate('/clientes')}>Volver al listado</button>
      </div>
      <div className="client-search">
        <label htmlFor="clientSearch">Seleccionar Cliente:</label>
        <input type="text" id="clientSearch" placeholder="Nombre de cliente" />
        <button className="search-button">Buscar</button>
      </div>
      {client && (
        <form onSubmit={handleSaveChanges}>
          <fieldset>
            <legend>Clientes</legend>
            <div className="form-group">
              <label htmlFor="name">Nombre Cliente:</label>
              <input
                type="text"
                id="name"
                name="client_name"
                value={client.client_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo:</label>
              <input
                type="email"
                id="email"
                name="client_email"
                value={client.client_email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Dirección:</label>
              <input
                type="text"
                id="address"
                name="client_address"
                value={client.client_address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="rut">RUT cliente:</label>
              <input
                type="text"
                id="rut"
                name="client_rut"
                value={client.client_rut}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                name="client_phone"
                value={client.client_phone}
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <button type="submit" className="save-button">Guardar Cambios</button>
        </form>
      )}
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
