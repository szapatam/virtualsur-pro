import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import logo from './visualsur.jpg';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Intentando ingresar con Usuario: ${username} y Contraseña: ${password}`);
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={logo} alt="Empresa Logo" className="logo-image" />
      </div>
      <div className="right-section">
        <form className="login-form">
          <h2>Iniciar Sesión</h2>
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" placeholder="Usuario" />
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" placeholder="Contraseña" />
          <button type="submit" onClick={() => navigate('/')}>Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
