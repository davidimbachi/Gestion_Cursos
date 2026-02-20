import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const listarProgramas = async () => {
  const respuesta = await axios.get(`${API_URL}/programas`);
  return respuesta.data;
};

export const buscarProgramas = async (termino) => {
  const respuesta = await axios.get(`${API_URL}/programas/buscar?texto=${termino}`);
  return respuesta.data;
};

export const crearOferta = async (datos) => {
  const respuesta = await axios.post(`${API_URL}/ofertas`, datos);
  return respuesta.data;
};

export const listarOfertas = async () => {
  const respuesta = await axios.get(`${API_URL}/ofertas`);
  return respuesta.data;
};