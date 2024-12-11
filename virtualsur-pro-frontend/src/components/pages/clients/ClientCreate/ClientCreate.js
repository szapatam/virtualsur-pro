// src/pages/clients/ClientCreate/ClientCreate.js
import React, { useState } from 'react';
import './ClientCreate.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClientCreate() {

    const navigate = useNavigate();


    // Estados y setters para los campos del formulario
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientRut, setClientRut] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Estados de valicación
    const [errors, setErrors] = useState({});

        // Validar los campos del formulario
        const validateFields = () => {
            const newErrors = {};
    
            if (!clientName.trim()) {
                newErrors.clientName = 'El nombre del cliente es obligatorio.';
            }
            if (!clientEmail.trim()) {
                newErrors.clientEmail = 'El correo electrónico es obligatorio.';
            }
            if (!clientAddress.trim()) {
                newErrors.clientAddress = 'La dirección es obligatorio.';
            }
            if (!clientPhone.trim()) {
                newErrors.clientPhone = 'El teléfono es obligatorio.';
            } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
                newErrors.clientEmail = 'El formato del correo es inválido.';
            }
            if (!clientRut.trim()) {
                newErrors.clientRut = 'El RUT del cliente es obligatorio.';
            } else if (!/^\d{7,8}-[0-9Kk]$/.test(clientRut)) {
                newErrors.clientRut = 'El formato del RUT es inválido.';
            }
            if (clientPhone.trim() && !/^\d+$/.test(clientPhone)) {
                newErrors.clientPhone = 'El teléfono debe contener solo números.';
            }
            
    
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0; // Si no hay errores, devuelve true
        };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); //Evitar recarga de pagina cuando se envia.

        if (!validateFields()) {
            return; // Si la validación falla, no continúa
        }

        try {
            // Se crea objeto para guardar datos del cliente a enviar al backend
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
            alert('Cliente creado con exito.')

            // Limpiar el formulario
            setClientName('');
            setClientEmail('');
            setClientAddress('');
            setClientRut('');
            setClientPhone('');

            navigate('/clientes')
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
            {Object.keys(errors).length > 0 && (
            <div className="error-list">
                <h4>Por favor, corrige los siguientes errores:</h4>
                <ul>
                {Object.keys(errors).map((key) => (
                    <li key={key}>{errors[key]}</li>
                ))}
                </ul>
            </div>
            )}
        </div>
        
    );
}

export default ClientCreate;
