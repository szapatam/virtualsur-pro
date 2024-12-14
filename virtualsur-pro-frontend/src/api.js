import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Cambia esto si usas otro puerto o dominio
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token); // Decodifica el token para verificar su expiración
    const now = Date.now() / 1000; // Tiempo actual en segundos

    // Refrescar el token si está a punto de expirar (por ejemplo, en 5 minutos)
    if (decodedToken.exp - now < 300) { // Expira en menos de 5 minutos
      try {
        const response = await axios.post('http://127.0.0.1:5000/auth/refresh',
           {},
          {
            headers: { Authorization: `Bearer ${token}` },
          });
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken); // Actualiza el token almacenado
        config.headers.Authorization = `Bearer ${newToken}`; // Usa el nuevo token
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        alert('Sesión expirada. Por favor, vuelva a iniciar sesión.')
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirige al login si falla el refresh
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
