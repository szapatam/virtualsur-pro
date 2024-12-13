import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token'); // Verifica si el usuario está autenticado

  if (!token) {
    // Redirige al login y pasa un mensaje a través de `state`
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Por favor, inicia sesión para continuar', from: location.pathname }}
      />
    );
  }

  return children; // Si hay token, renderiza la ruta protegida
};

export default ProtectedRoute;
