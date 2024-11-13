// src/pages/clients/ClientCreate/ClientCreate.js
import React, { useState } from 'react';
import './ClientCreate.css';
import { useNavigate } from 'react-router-dom';

function ClientCreate() {

    const navigate = useNavigate();

    // Estados locales para los datos del formulario
    const [clientCreateData, setClientCreateData] = useState({
        name: '',
        email: '',
        address: '',
        rut: '',
        phone: '',
    });

    // Maneja cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientCreateData({ ...clientCreateData, [name]: value });
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí se realizaría la lógica para enviar los datos del formulario
        console.log('Datos del Cliente:', clientCreateData);
    };

    return (
        <div className="client-create-container">
            <div className='client-create-header'>
                <h1>Ingresar Cliente</h1>
                <button className="back-to-list-button" onClick={() => navigate('/clientes')}>
                    Volver al Listado
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos del Cliente</legend>
                    <div className="form-group">
                        <label htmlFor="name">Nombre cliente:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={clientCreateData.name}
                            onChange={handleInputChange}
                            placeholder="Ejemplo de Nombre"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={clientCreateData.email}
                            onChange={handleInputChange}
                            placeholder="test@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Dirección:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={clientCreateData.address}
                            onChange={handleInputChange}
                            placeholder="Calle test #123"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rut">RUT cliente:</label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={clientCreateData.rut}
                            onChange={handleInputChange}
                            placeholder="12345678-9"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={clientCreateData.phone}
                            onChange={handleInputChange}
                            placeholder="111222333"
                        />
                    </div>
                </fieldset>
                <div className='save-button-container'>
                <button type="submit" className="save-button">Guardar Cambios</button>
                </div>
                
            </form>
        </div>
    );
}

export default ClientCreate;
