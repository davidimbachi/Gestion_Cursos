import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const listarOfertas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ofertas`);
    return response.data;
  } catch (error) {
    console.error('Error al listar ofertas:', error);
    throw error;
  }
};