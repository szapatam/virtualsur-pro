import React, {useState, useEffect } from 'react';
import './ContractDetail.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ContractDetail() {

    const navigate = useNavigate();
    const [client, setClient] = useState([]);
    
    useEffect(() => {
        const fetchCLient = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/Clients');
            setClient(response.data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
        };  

        fetchCLient();
    }, []);

    return (
        <div class="form-detail-container">
            <div class="contract">
                <div className='new-contract-header'>
                    <h1>Crear Contrato</h1>
                    <button className="back-to-list-button" onClick={() => navigate('/ContractList')}>
                        Volver al Listado
                    </button>
                </div>
                <div className='contract-section-box'>
                    <fieldset>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Ingresar Cliente: </label>
                                <select id='cbxClients'>
                            <option value="">Seleccione un rol</option>
                            {Array.isArray(client) && client.map((client) => (
                            <option key={client.client_id} value={client.client_id}>
                                {client.client_name}
                             </option>
                            ))}
                                </select>
                                <label>Nombre del evento: </label>
                                <input type='text' />
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Fecha Inicio contrato: </label>
                                <input type='date' />
                                <label>Fecha Ejec. evento: </label>
                                <input type='date' />
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Lugar del evento: </label>
                                <input type='text' />
                                <label>Metros cuadrados: </label>
                                <input type='text' />
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-group'>
                                <label>Valor metro cuadrado: </label>
                                <input type='text' />
                                <label>Costo Adicional: </label>
                                <input type='text' />
                            </div>
                        </div>
                        <div className='form-detail-row'>
                            <div className='form-detail-final-price-group'>
                                <label>VALOR TOTAL</label>
                                <input type='text' />
                            </div>

                        </div>

                    </fieldset>
                    <div className='save-button-container'>
                        <button className='submit-button'> Guardar Cambios</button>
                    </div>
                </div>
            </div>
            <div class="inventory">
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Equipamiento</legend>
                        <table className="contracts-table">
                            <thead>
                                <tr>
                                    <th>Encabezado A</th>
                                    <th>Encabezado B</th>
                                    <th>Encabezado C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Celda A</td>
                                    <td>Celda B</td>
                                    <td>Celda C</td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <button className='add-iventory-item'>Añadir</button>
                    <button className='remove-item'>Eliminar</button>
                </div>
            </div>
            <div class="personal">
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Personal</legend>
                        <table className="contracts-table">
                            <thead>
                                <tr>
                                    <th>Encabezado A</th>
                                    <th>Encabezado B</th>
                                    <th>Encabezado C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Celda A</td>
                                    <td>Celda B</td>
                                    <td>Celda C</td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <button className='add-iventory-item'>Añadir</button>
                    <button className='remove-item'>Eliminar</button>
                </div>
            </div>
            <div class="docs">
                <div className="contract-section-box">
                    <fieldset>
                        <legend>Documentos</legend>
                        <table className="contracts-table">
                            <thead>
                                <tr>
                                    <th>Encabezado A</th>
                                    <th>Encabezado B</th>
                                    <th>Encabezado C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Celda A</td>
                                    <td>Celda B</td>
                                    <td>Celda C</td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <button className='add-iventory-item'>Añadir</button>
                    <button className='remove-item'>Eliminar</button>
                </div>
            </div>
        </div>
    );
}

export default ContractDetail;