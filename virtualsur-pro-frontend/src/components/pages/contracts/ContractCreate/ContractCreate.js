import {React, useEffect, useState} from 'react';
import './ContractCreate.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function NewContract() {

    const navigate = useNavigate();
    const [client, setClient] = useState([]);
    
    useEffect(() => {
        const fetchCLient = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/Clients');
            setClient(response.data);
            console.log(setClient);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
        };  

        fetchCLient();
    }, []);


    return (
        <div class="new-contract-container">
            <div className='new-contract-header'>
                <h1>Crear Contrato</h1>
                <button className="back-to-list-button" onClick={() => navigate('/ContractList')}>
                    Volver al Listado
                </button>
            </div>
            <div className='grid'>
                <div class="box1">
                    <form>
                    <div className='contract-section-box'>
                        <fieldset>
                            <legend> Nuevo Contrato</legend>
                            <div className='form-row'>
                                <label>Ingresar Cliente: </label>
                                <select id='cbxClients' className='contract-form'>
                            <option value="">Seleccione un rol</option>
                            {Array.isArray(client) && client.map((client) => (
                            <option key={client.client_id} value={client.client_id}>
                                {client.client_name}
                             </option>
                            ))}
                                </select>
                                <label className='event-name'>Nombre del evento:</label>
                                <input type='text' className='contract-form'></input>
                            </div>
                            <div className='form-row'>
                                <label>Fecha Inicio contrato: </label>
                                <input type='date' className='contract-form'></input>
                                <label>Fecha Ejec. evento:</label>
                                <input type='date' className='contract-form'></input>
                            </div>
                            <div className='form-row'>
                                <label>Lugar del evento: </label>
                                <input type='text' className='contract-form'></input>
                                <label>Metros cuadrados:</label>
                                <input type='text' className='contract-form'></input>
                            </div>
                            <div className='form-row'>
                                <label>Valor metro cuadrado: </label>
                                <input type='text' className='contract-form'></input>
                                <label>Costo Adicional:</label>
                                <input type='text' className='contract-form'></input>
                            </div>
                            <div className='form-final-price-row'>
                                <label className='final-cost'>COSTO TOTAL:</label>
                                <input type='text' className='contract-form'></input>
                            </div>
                        </fieldset>
                        <div className='save-button-container'>
                            <button className='submit-button'> Crear Contrato</button>
                        </div>
                        
                    </div>
                    </form>

                </div>
                <div class="box2">
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
                <div class="box3">
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
            </div>
        </div>
    );
}

export default NewContract;
