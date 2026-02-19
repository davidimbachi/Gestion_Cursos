import React, { useState, useEffect } from 'react';
import { listarOfertas } from '../services/api';

const OfertasList = () => {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        const data = await listarOfertas();
        setOfertas(data);
      } catch (error) {
        window.mostrarNotificacion('error', 'Error al cargar ofertas');
      } finally {
        setCargando(false);
      }
    };
    cargarOfertas();
  }, []);

  if (cargando) return <div className="dashboard-content">Cargando...</div>;

  return (
    <div className="dashboard-content">
      <h2>Listado de Ofertas</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {ofertas.map(oferta => (
          <div key={oferta._id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow)'
          }}>
            <h3>Ficha: {oferta.codigo_ficha}</h3>
            <p>Programa: {oferta.programa?.nombre}</p>
            <p>Cupos: {oferta.cupo}</p>
            <p>Inicio: {new Date(oferta.fecha_inicio).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfertasList;