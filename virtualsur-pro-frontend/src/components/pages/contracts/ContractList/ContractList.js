import React, { useState } from 'react';
import './ContractList.css';
import { useNavigate } from 'react-router-dom';

function ContractList() {

    const navigate = useNavigate();

    const handleaddEqupmentClick = () => {
        navigate('/ContractCreate');
    }

    const [contracts] = useState([
        { id: 'C001', month: 'Enero', client: 'Cliente A', status: 'Activo', detail: 'Detalle A' },
        { id: 'C002', month: 'Febrero', client: 'Cliente B', status: 'Inactivo', detail: 'Detalle B' },
        { id: 'C003', month: 'Marzo', client: 'Cliente C', status: 'Pendiente', detail: 'Detalle C' },
    ]);

    return (
        <div className="contract-list-container">
            <div className="contract-list-header">
                <h1>Listado Contratos</h1>
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
                            <th>Encabezado A</th>
                            <th>Encabezado B</th>
                            <th>Encabezado C</th>
                            <th>Encabezado D</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(contract => (
                            <tr key={contract.id}>
                                <td>{contract.id}</td>
                                <td>{contract.month}</td>
                                <td>{contract.client}</td>
                                <td>
                                    <button className="view-button">Ver/Editar</button>
                                    <button className="delete-button">Eliminar</button>
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
