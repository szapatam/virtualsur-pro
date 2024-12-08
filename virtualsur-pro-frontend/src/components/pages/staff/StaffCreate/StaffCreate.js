// src/pages/staff/StaffCreate/StaffCreate.js
import React, { useEffect, useState } from 'react';
import './StaffCreate.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StaffCreate() {

    const navigate = useNavigate();

    //Estado para campos de fomulario
    const [staffName, setStaffName] = useState('');
    const [staffRut, setStaffRut] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffPhone, setStaffPhone] = useState('');
    const [staffAddress, setStaffAddress] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [status, setStatus] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
      const fetchRoles = async () => {
          try {
              const response = await axios.get('http://127.0.0.1:5000/roles');
              console.log(response.data); // Asegúrate de que sea un array
              setRoles (response.data)

          } catch (error){
            console.error('Error al cargar Roles', error);
          }
      };
    

    fetchRoles();
    }, []);

    //Manejo de envio de formulario
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        //Datos del personal a enviar al backend
        const nuevoPersonal = {
        staff_name: staffName,
        staff_rut: staffRut,
        staff_email: staffEmail,
        staff_phone: staffPhone,
        staff_address: staffAddress,
        role_id: roleId,
        status: status
      };
      console.log(nuevoPersonal);

      //Solicitud POST al backend para nuevo personal
      const response = await axios.post('http://127.0.0.1:5000/personal', nuevoPersonal);
      
      setMensaje(response.data.mensaje)
      alert("Personal creado con exito.")

      //Limpiar el formulario
      setStaffName('');
      setStaffRut('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffAddress('');
      setRoles([])
      setStatus('');

      //Redirigir a listado
      navigate('/personal')
    } catch (error){
        console.error('Error al agregar el personal', error);
        setMensaje('Hubo un error al agregar el personal');
    }
  };

  return (
    <div className="staff-create-container">
      <div className="staff-create-header"> {/* CAMBIO!! */}
        <h1>Ingresar Personal</h1>
        {mensaje && <p>{mensaje}</p>}
        <button className="back-to-list-button" onClick={() => navigate('/personal')} >Volver al Listado</button> {/* Botón para volver al listado */}
      </div>
      
      <form className="staff-create-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Personal</legend>
        <div className="form-group">
          <label htmlFor="name">Nombre Personal:</label>
          <input type="text" id="name" placeholder="Ejemplo de Nombre" value={staffName} onChange={(e) => setStaffName(e.target.value)} />

          <label htmlFor="rut">RUT Personal:</label>
          <input type="text" id="rut" placeholder="12345678-9" value={staffRut} onChange={(e) => setStaffRut(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo:</label>
          <input type="email" id="email" placeholder="test@ejemplo.com" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} />

          <label htmlFor="phone">Teléfono:</label>
          <input type="text" id="phone" placeholder="111222333" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <input type="text" id="address" placeholder="Calle test #123" value={staffAddress} onChange={(e) => setStaffAddress(e.target.value)} />

          <label htmlFor="role">Rol:</label>
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            <option value="">Seleccione un Rol</option>
            {roles.map(role =>(
              <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
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
        <div className='save-button-container'>
            <button type="submit" className="save-button">Guardar Cambios</button>
        </div> 
      </form>
    </div>
  );
}

export default StaffCreate;
