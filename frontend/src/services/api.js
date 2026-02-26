import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// 🔹 Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔹 Interceptor: Agrega el token automáticamente a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // o sessionStorage si usas eso
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 Tus funciones (ahora usan la instancia 'api' con interceptor)
export const listarProgramas = async () => {
  const respuesta = await api.get('/programas');
  return respuesta.data;
};

export const buscarProgramas = async (termino) => {
  const respuesta = await api.get(`/programas/buscar?texto=${termino}`);
  return respuesta.data;
};

export const crearOferta = async (datos) => {
  const respuesta = await api.post('/ofertas', datos);
  return respuesta.data;
};

export const listarOfertas = async () => {
  const respuesta = await api.get('/ofertas');  // ✅ Ahora sí lleva token automáticamente
  return respuesta.data;
};

export default api;