import React, { useEffect, useState } from 'react';
import './ClientList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function ClientList() {

  const navigate = useNavigate();

  const handleAddClientClick = () => {
    navigate('/clientes/nuevo');
  };

  const handleViewClientClick = (clientId) => {
    console.log('Client ID:', clientId);
    if (clientId) {
      navigate(`/clientes/${clientId}`);
    } else {
      console.error('Client ID is undefined')
    }
  }

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener los clientes del backend
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/clientes');
      setClients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Hubo un error al obtener la lista de clientes');
      setLoading(false);
    }
  };

  // Llamamos a fetchClients al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  //Eliminar clientes
  const handleDeleteClient = (clientId) => {
    //solicitud DELETE al backend
    axios.delete(`http://127.0.0.1:5000/clientes/${clientId}`)
    .then(response => {
      //Eliminar cliente del estado para actualizar la lista
      setClients(clients.filter(client => client.client_id !== clientId));
      alert('Cliente Eliminado con exito');
    })
    .catch(error =>{
      console.error('Error al eliminar cliente', error);
      alert('Hubo un error al eliminar cliente')
    })
    
  }

  return (
    <div className="client-list">
      <div className="client-list-header">
        <h1>Listado de Clientes</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="error-message">{error}</p>}
        <button className="new-client-button" onClick={handleAddClientClick}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Cliente
        </button>
      </div>
      <div className="client-search">
        <label htmlFor="client-search">Buscar cliente:</label>
        <input type="text" id="client-search" placeholder="Nombre de cliente" />
      </div>
      <table className="client-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>RUT</th>
            <th>N° de Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.client_id}>
              <td>{client.client_name}</td>
              <td>{client.client_email}</td>
              <td>{client.client_address}</td>
              <td>{client.client_rut}</td>
              <td>{client.client_phone}</td>
              <td>
                <button onClick={() => handleViewClientClick(client.client_id)} className="action-button edit">
                  <FontAwesomeIcon icon={faEdit} /> Ver/Editar
                </button>
                <button className="action-button delete" onClick={() => handleDeleteClient(client.client_id)} >
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

export default ClientList;