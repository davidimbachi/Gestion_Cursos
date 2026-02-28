import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SolicitudesInstructor = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      // el endpoint debe ser el mismo que en el backend
      const respuesta = await api.get('/solicitudes/mis-ofertas');
      setSolicitudes(respuesta.data);
      console.log('✅ Solicitudes cargadas:', respuesta.data.length);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('No se pudieron cargar las solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const getBadgeEstado = (estado) => {
    const estilos = {
      revision: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🔄 En revisión' },
      pendiente: { bg: 'bg-blue-100', text: 'text-blue-800', label: '⏳ Pendiente' },
      aprobada: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Aprobada' },
      rechazada: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Rechazada' }
    };
    return estilos[estado] || { bg: 'bg-gray-100', text: 'text-gray-800', label: estado };
  };

  if (cargando) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p style={{ marginTop: '15px' }}>Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc2626' }}></i>
        <p style={{ marginTop: '15px', color: '#dc2626' }}>{error}</p>
        <button onClick={cargarSolicitudes} className="btn btn-primary">
          <i className="fas fa-sync-alt me-2"></i>Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a3274 0%, #1e40af 100%)',
        padding: '25px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '25px'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          <i className="fas fa-envelope-open-text me-2"></i>
          Mis Solicitudes
        </h2>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
          Ofertas enviadas a revisión del coordinador
        </p>
      </div>

      {/* Lista de solicitudes */}
      {solicitudes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <i className="fas fa-inbox" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}></i>
          <p style={{ fontSize: '16px' }}>No tienes solicitudes enviadas aún</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Ve a "Mis ofertas" y envía una oferta a revisión
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {solicitudes.map((sol) => {
            const badge = getBadgeEstado(sol.estado);
            return (
              <div 
                key={sol._id} 
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0a3274';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(10, 50, 116, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                  {/* Información de la oferta */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: '#0a3274', 
                      fontSize: '18px', 
                      fontWeight: '600' 
                    }}>
                      {sol.oferta?.programa?.nombre || 'Sin programa'}
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>
                        <i className="fas fa-hashtag me-1"></i>
                        <strong>Ficha:</strong> {sol.oferta?.codigo_ficha || 'N/A'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>
                        <i className="fas fa-users me-1"></i>
                        <strong>Cupos:</strong> {sol.oferta?.cupo || 'N/A'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>
                        <i className="fas fa-calendar me-1"></i>
                        <strong>Inicio:</strong> {new Date(sol.oferta?.fecha_inicio).toLocaleDateString('es-CO')}
                      </div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>
                        <i className="fas fa-map-marker-alt me-1"></i>
                        <strong>Sede:</strong> {sol.oferta?.lugar?.ambiente || 'N/A'}
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      <i className="fas fa-clock me-1"></i>
                      Enviada: {new Date(sol.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Badge de estado */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }} className={`${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    
                    {/* Motivo de rechazo si aplica */}
                    {sol.estado === 'rechazada' && sol.motivoRechazo && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: '#fef2f2',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#dc2626',
                        border: '1px solid #fecaca'
                      }}>
                        <strong>Motivo:</strong> {sol.motivoRechazo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolicitudesInstructor;