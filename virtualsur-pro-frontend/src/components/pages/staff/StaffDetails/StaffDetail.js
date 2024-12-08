import React, { useState, useEffect } from 'react';
import './StaffDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function StaffDetail() {
    const navigate = useNavigate();

    const { staffId } = useParams();

    const [staffName, setStaffName] = useState('');
    const [staffRut, setStaffRut] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffPhone, setStaffPhone] = useState('');
    const [staffAddress, setStaffAddress] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [status, setStatus] = useState('');
    const [mensaje, setMensaje] = useState('');

      // Obtener el listado de roles al cargar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      }
    };  

    fetchRoles();
  }, []);
    useEffect(() => {
      // Fetch the details of the staff by id
      const fetchStaffDetails = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/personal/${staffId}`);
          const staffData = response.data;
  
          setStaffName(staffData.staff_name);
          setStaffRut(staffData.staff_rut);
          setStaffEmail(staffData.staff_email);
          setStaffPhone(staffData.staff_phone);
          setStaffAddress(staffData.staff_address);
          setRoleId(staffData.role_id);
          setStatus(staffData.status);
        } catch (error) {
          console.error('Error al obtener el detalle del personal:', error);
          setMensaje('Hubo un error al obtener los detalles del personal.');
        }
      };
  
      fetchStaffDetails();
    }, [staffId]);
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const updatedStaff = {
          staff_name: staffName,
          staff_rut: staffRut,
          staff_email: staffEmail,
          staff_phone: staffPhone,
          staff_address: staffAddress,
          role_id: roleId, 
          status: status
        };
  
        const response = await axios.put(`http://127.0.0.1:5000/personal/${staffId}`, updatedStaff);
        setMensaje(response.data.message);
      } catch (error) {
        console.error('Error al actualizar el personal:', error);
        setMensaje('Hubo un error al actualizar los datos del personal.');
      }
    };

    return (
        <div className="staff-detail-container">
            <div className="staff-detail-header">
                <h2>Detalle Personal</h2>
                { mensaje && <p className='message'>{mensaje}</p>}
                <button className='back-to-list-button' onClick={() => navigate('/personal')} > Volver al listado</button>
            </div>
            <div className="staff-search">
                <label htmlFor="staffSearch">Seleccionar Personal:</label>
                <input type="text" id="staffSearch" placeholder="Nombre de personal" />
                <button className="search-button">Buscar</button>
            </div>
            <form onSubmit={handleUpdate}>
                <fieldset>
                    <legend>Personal</legend>
                    <div className="form-group">
                        <label htmlFor="name">Nombre Personal:</label>
                        <input
                            type="text"
                            id="name"
                            name="staff_name"
                            value={staffName}
                            onChange={(e) => setStaffName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo:</label>
                        <input
                            type="email"
                            id="email"
                            name="staff_email"
                            value={staffEmail}
                            onChange={(e) => setStaffEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Dirección:</label>
                        <input
                            type="text"
                            id="address"
                            name="staff_address"
                            value={staffAddress}
                            onChange={(e) => setStaffEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rut">RUT Personal:</label>
                        <input
                            type="text"
                            id="rut"
                            name="staff_rut"
                            value={staffRut}
                            onChange={(e) => setStaffRut(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="staff_phone"
                            value={staffPhone}
                            onChange={(e) => setStaffPhone(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Rol:</label>
                        <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                            <option value="">Seleccione un rol</option>
                            {Array.isArray(roles) && roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                                {role.role_name}
                             </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Estado:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Disponible">Disponible</option>
                            <option value="Asignado">Asignado</option>
                        </select>
                    </div>
                </fieldset>
                <button type="submit" className="save-button">Guardar Cambios</button>
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
