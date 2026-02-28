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

// 🔹 Enviar oferta a solicitud
export const enviarOferta = async (id) => {
  const respuesta = await api.put(`/ofertas/enviar/${id}`);
  return respuesta.data;
};

// 🔹 Listar solicitudes del instructor (ofertas YA enviadas)
export const listarSolicitudesInstructor = async () => {
  const respuesta = await api.get('/solicitudes-ofertas/mis-solicitudes');
  return respuesta.data;
};

// 🔹 Listar solicitudes para coordinador
export const listarSolicitudesCoordinador = async () => {
  const respuesta = await api.get('/solicitudes-ofertas/coordinador');
  return respuesta.data;
};

// 🔹 Aprobar/rechazar solicitud
export const actualizarEstadoSolicitud = async (id, estado) => {
  const respuesta = await api.put(`/solicitudes-ofertas/${id}/estado`, { estado });
  return respuesta.data;
};
export default api;