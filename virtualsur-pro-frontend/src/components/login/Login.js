import React, { useState } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from './visualsur.jpg';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation(); // Obtenemos el `state` de la redirección
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault(); // Evita el recargado de la página

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        email,
        password,
      });

      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.access_token);

     // Redirigir a la página anterior o al home
     const redirectTo = location.state?.from || '/';
     navigate(redirectTo);
      setError('');
    } catch (err) {
      console.error('Error en login:', err.response?.data);
      setError(err.response?.data.error || 'Error en login');
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={logo} alt="Empresa Logo" className="logo-image" />
      </div>
      <div className="right-section">
        {/* Mensaje de aviso si es redirigido */}
        {location.state?.message && <p style={{ color: 'red' }}>{location.state.message}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <label htmlFor="username">Email:</label>
          <input type="email" id="username" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" >Ingresar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
