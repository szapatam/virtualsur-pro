import React from 'react';
import './ContractCreate.css';
import { useNavigate } from 'react-router-dom';
function NewContract() {

    const navigate = useNavigate();

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
                    <div className='contract-section-box'>
                        <fieldset>
                            <legend> Nuevo Contrato</legend>
                            <div className='form-row'>
                                <label>Ingresar Cliente: </label>
                                <select className='contract-form'>
                                    <option value="cliente">Seleccionar cliente</option>
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
