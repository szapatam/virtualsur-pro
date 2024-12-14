import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ContractList.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../../api';

function ContractList() {
    const navigate = useNavigate();
    const handleaddEqupmentClick = () => {
        navigate('/ContractCreate');
    }


    //Creación de estados
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await api.get('http://127.0.0.1:5000/contracts');
                setContracts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Hubo un error al obtener el listado de contratos');
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

    const handleDeleteContract = async (contractId) => {
        const confirmDelete = window.confirm("¿Está seguro de que desea eliminar este contrato?");
        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`http://127.0.0.1:5000/contracts/${contractId}`);
            alert('Contrato eliminado con éxito.');

            // Actualizar la lista de contratos después de la eliminación
            setContracts(contracts.filter(contract => contract.contract_id !== contractId));
        } catch (error) {
            console.error('Error al eliminar el contrato:', error);
            alert('Hubo un error al eliminar el contrato. Existen recursos asignados.');
        }
    };

    return (
        <div className="contract-list-container">
            <div className="contract-list-header">
                <h1>Listado Contratos</h1>
                {loading && <p>Cargando...</p>}
                {error && <p className='error-message'>{error}</p>}
                <button className='new-contract-button' onClick={handleaddEqupmentClick}>Nuevo Contrato</button>
            </div>

            <div className="contract-list-search">
                <label htmlFor="search">Buscar contrato:</label>
                <div className="search-input-container">
                    <input type="text" id="search" placeholder="Código de contrato" />
                    <select className='filter-select'>
                        <option value="">Mes</option>
                        <option value="Enero">Enero</option>
                        <option value="Febrero">Febrero</option>
                        <option value="Marzo">Marzo</option>
                    </select>
                    <select className='filter-select'>
                        <option value="">Cliente</option>
                        <option value="Cliente A">Cliente A</option>
                        <option value="Cliente B">Cliente B</option>
                        <option value="Cliente C">Cliente C</option>
                    </select>
                    <select className='filter-select'>
                        <option value="">Estado</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>
            </div>
            <div className="contract-list-table">
                <table>
                    <thead>
                        <tr>
                            <th>Código Contrato</th>
                            <th>Nombre del Cliente</th>
                            <th>Nombre del Evento</th>
                            <th>Fecha de Inicio</th>
                            <th>Fecha de Ejecución</th>
                            <th>Lugar del Evento</th>
                            <th>Metros Cuadrados</th>
                            <th>Costo Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map((contract) => (
                            <tr key={contract.contract_id}>
                                <td>{contract.contract_code}</td>
                                <td>{contract.client_name}</td>
                                <td>{contract.event_name}</td>
                                <td>{contract.contract_start_date}</td>
                                <td>{contract.event_execution_date}</td>
                                <td>{contract.event_location}</td>
                                <td>{contract.square_meters}</td>
                                <td>{contract.total_cost}</td>
                                <td>{contract.status}</td>
                                <td>
                                    <button onClick={() => navigate(`/contract/${contract.contract_id}`)} className="action-button edit">
                                        <FontAwesomeIcon icon={faEdit} /> Ver/Editar
                                    </button>
                                    <button className="action-button delete" onClick={() => handleDeleteContract(contract.contract_id)}>
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

export default ContractList;
