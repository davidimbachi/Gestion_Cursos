import React, { useState, useEffect } from 'react';
import { listarOfertas } from '../services/api';

const OfertasList = () => {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const data = await listarOfertas();
        setOfertas(data);
        setCargando(false);
      } catch (err) {
        setError(err.message);
        setCargando(false);
      }
    };

    cargarOfertas();
  }, []);

  if (cargando) return <div>Cargando ofertas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Listado de Ofertas</h1>
      {ofertas.map((oferta) => (
        <div key={oferta._id} style={styles.card}>
          <h3>Ficha: {oferta.codigo_ficha || 'Sin código'}</h3>
          <p><strong>Programa:</strong> {oferta.programa?.nombre || 'N/A'}</p>
          <p><strong>Instructor:</strong> {oferta.usuario?.nombre || 'N/A'}</p>
          <p><strong>Cupos:</strong> {oferta.cupo}</p>
          <p><strong>Fecha inicio:</strong> {new Date(oferta.fecha_inicio).toLocaleDateString()}</p>
          <p><strong>Modalidad:</strong> {oferta.modalidad_oferta}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    margin: '10px',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.1)'
  }
};

export default OfertasList;