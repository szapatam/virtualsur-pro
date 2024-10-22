import React from 'react';
import './ClientList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



function ClientList() {

  const navigate = useNavigate();

  const handleAddClientClick = () => {
    navigate('/clientes/nuevo');
  };

  return (
    <div className="client-list">
      <div className="client-list-header">
        <h1>Listado de Clientes</h1>
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
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Ejemplo de filas de clientes, aquí se debería usar un map con datos reales */}
          <tr>
            <td>Juan Pérez</td>
            <td>Calle Falsa 123</td>
            <td>123456789</td>
            <td>
              <button className="action-button edit">
                <FontAwesomeIcon icon={faEdit} /> Ver/Editar
              </button>
              <button className="action-button delete">
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
            </td>
          </tr>
          <tr>
            <td>María González</td>
            <td>Avenida Falsedad 123</td>
            <td>987654321</td>
            <td>
              <button className="action-button edit">
                <FontAwesomeIcon icon={faEdit} /> Ver/Editar
              </button>
              <button className="action-button delete">
                <FontAwesomeIcon icon={faTrash} /> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ClientList;