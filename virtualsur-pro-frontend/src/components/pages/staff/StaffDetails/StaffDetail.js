import React, { useState } from 'react';
import './StaffDetail.css';
import { useNavigate } from 'react-router-dom';

function StaffDetail() {

    const navigate = useNavigate();

    const [staffDetailData, setstaffDetailData] = useState({
        name: 'Ejemplo de Nombre',
        email: 'test@ejemplo.com',
        address: 'Calle test #123',
        rut: '12345678-9',
        phone: '111222333',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setstaffDetailData({ ...staffDetailData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Cambios Guardados:', staffDetailData);
    };

    const handleDeletestaff = () => {
        console.log('Personal Eliminado:', staffDetailData.name);
        navigate('/personal');
    };


    return (
        <div className="staff-detail-container">
            <div className="staff-detail-header">
                <h2>Detalle Personal</h2>
                <button className='back-to-list-button' onClick={() => navigate('/personal')} > Volver al listado</button>
            </div>
            <div className="staff-search">
                <label htmlFor="staffSearch">Seleccionar Personal:</label>
                <input type="text" id="staffSearch" placeholder="Nombre de personal" />
                <button className="search-button">Buscar</button>
            </div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Personal</legend>
                    <div className="form-group">
                        <label htmlFor="name">Nombre Personal:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={staffDetailData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={staffDetailData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Dirección:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={staffDetailData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rut">RUT Personal:</label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={staffDetailData.rut}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={staffDetailData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                </fieldset>
                <button type="submit" className="save-button">Guardar Cambios</button>
                <button type="button" className="delete-button" onClick={handleDeletestaff}>Eliminar Personal</button>
            </form>
            <div className="contracts-section">
                <fieldset>
                    <legend>Contratos</legend>
                    <table className="contracts-table">
                        <thead>
                            <tr>
                                <th>Encabezado A</th>
                                <th>Encabezado B</th>
                                <th>Encabezado C</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Celda A</td>
                                <td>Celda B</td>
                                <td>Celda C</td>
                                <td><button className="view-contract-button">Ver Contrato</button></td>
                            </tr>
                            {/* Aquí irían más filas de contratos asociados */}
                        </tbody>
                    </table>
                </fieldset>
            </div>
        </div>
    );
}

export default StaffDetail;
