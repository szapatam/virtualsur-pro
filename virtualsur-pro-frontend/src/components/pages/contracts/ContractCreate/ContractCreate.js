import {React, useEffect, useState} from 'react';
import './ContractCreate.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function NewContract() {

    const navigate = useNavigate();

    //Estados del formulario
    const [clientId, setClientId] = useState('');
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [executionDate, setExecutionDate] = useState('');
    const [location, setLocation] = useState('');
    const [squareMeters, setSquareMeters] = useState('');
    const [squareMeterValue, setSquareMeterValue] = useState('');
    const [additionalCost, setAdditionalCost] = useState('');
    const [totalCost, setTotalCost] = useState('0');
    const [clients, setClients] = useState([]);

    //Obtener clientes disponibles
    useEffect(() => {
        const fetchClients = async () =>{
            try {
                const response = await axios.get('http://127.0.0.1:5000/clientes')
                setClients(response.data);
            } catch (error){
                console.error("Hubo un error al obtener los clientes", error);
            }
        };
        fetchClients();
    }, []);

    //Calcular costo total
    useEffect(() => {
        const cost = (parseFloat(squareMeters) || 0) * (parseFloat(squareMeterValue) || 0) + (parseFloat(additionalCost) || 0);
        setTotalCost(cost);
    }, [squareMeters, squareMeterValue, additionalCost]);

    //Manejar la creación del contrato
    const handleCreateContract = async (e) => {
        e.preventDefault();

        const NewContract ={
            client_id: clientId,
            event_name: eventName,
            contract_start_date: startDate,
            event_execution_date: executionDate,
            event_location: location,
            square_meters: squareMeters,
            square_meter_value: squareMeterValue,
            additional_cost: additionalCost,
            total_cost: totalCost
        };

        try {
            await axios.post('http://127.0.0.1:5000/contracts', NewContract);
            alert('Contrato reado con éxito.');
            navigate('/ContractList')
        } catch (error){
            console.error('Hubo un error al crear el contrato', error);
        }
    };


    return (
        <div className="new-contract-container">
            <div className='new-contract-header'>
                <h1>Crear Contrato</h1>
                <button className="back-to-list-button" onClick={() => navigate('/ContractList')}>
                    Volver al Listado
                </button>
            </div>
            <div className='grid'>
                <div className="box1">
                    <form onSubmit={handleCreateContract}>
                    <div className='contract-section-box'>
                        <fieldset>
                            <legend> Nuevo Contrato</legend>
                            <div className='form-row'>
                                <label>Ingresar Cliente: </label>
                                <select value={clientId} onChange={(e) => setClientId(e.target.value)} className='contract-form'>
                                    <option value="">Seleccione un cliente</option>
                                    {clients.map(client =>(
                                        <option key={client.client_id} value={client.client_id}>
                                            {client.client_name}
                                        </option>
                                    ))}
                                </select>
                                <label className='event-name'>Nombre del evento:</label>
                                <input type='text' className='contract-form' value={eventName} onChange={(e) => setEventName(e.target.value)}></input>
                            </div>
                            <div className='form-row'>
                                <label>Fecha Inicio contrato: </label>
                                <input type='date' className='contract-form' value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                                <label>Fecha Ejec. evento:</label>
                                <input type='date' className='contract-form' value={executionDate} onChange={(e) => setExecutionDate(e.target.value)}></input>
                            </div>
                            <div className='form-row'>
                                <label>Lugar del evento: </label>
                                <input type='text' className='contract-form' value={location} onChange={(e) => setLocation(e.target.value)}></input>
                                <label>Metros cuadrados:</label>
                                <input type='text' className='contract-form' value={squareMeters} onChange={(e) => setSquareMeters(e.target.value)}></input>
                            </div>
                            <div className='form-row'>
                                <label>Valor metro cuadrado: </label>
                                <input type='number' className='contract-form' value={squareMeterValue} onChange={(e) => setSquareMeterValue(e.target.value)}></input>
                                <label>Costo Adicional:</label>
                                <input type='number' className='contract-form' value={additionalCost} onChange={(e) => setAdditionalCost(e.target.value)}></input>
                            </div>
                            <div className='form-final-price-row'>
                                <label className='final-cost'>COSTO TOTAL:</label>
                                <input type='number' className='contract-form' value={totalCost} onChange={(e) => setTotalCost(e.target.value)}></input>
                            </div>
                        </fieldset>
                        <div className='save-button-container'>
                            <button className='submit-button' type='submit'> Crear Contrato</button>
                        </div>
                        
                    </div>
                    </form>

                </div>
                <div className="box2">
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
                <div className="box3">
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
