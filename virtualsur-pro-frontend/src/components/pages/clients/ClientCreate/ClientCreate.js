// src/pages/clients/ClientCreate/ClientCreate.js
import React, { useState } from 'react';
import './ClientCreate.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClientCreate() {

    const navigate = useNavigate();


    // Estados para los campos del formulario
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientRut, setClientRut] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Datos del cliente a enviar al backend
            const nuevoCliente = {
                client_name: clientName,
                client_email: clientEmail,
                client_address: clientAddress,
                client_rut: clientRut,
                client_phone: clientPhone,
            };

            console.log(nuevoCliente); // Log para verificar los datos antes de enviar

            // Solicitud POST al backend para agregar un nuevo cliente
            const response = await axios.post('http://127.0.0.1:5000/clientes', nuevoCliente);

            // Mostrar mensaje si el cliente se agregó correctamente
            setMensaje(response.data.mensaje);

            // Limpiar el formulario
            setClientName('');
            setClientEmail('');
            setClientAddress('');
            setClientRut('');
            setClientPhone('');
        } catch (error) {
            console.error('Error al agregar el cliente:', error);
            setMensaje('Hubo un error al agregar el cliente.');
        }
    };

    return (
        <div className="client-create-container">
            <div className='client-create-header'>
                <h1>Ingresar Cliente</h1>
                {mensaje && <p className="mensaje">{mensaje}</p>}
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
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
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
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
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
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            placeholder="Calle test #123"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rut">RUT cliente:</label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={clientRut}
                            onChange={(e) => setClientRut(e.target.value)}
                            placeholder="12345678-9"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
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
