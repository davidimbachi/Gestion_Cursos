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
      const respuesta = await api.get('/solicitudes-ofertas/mis-ofertas');
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
      revision: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        border: 'border-yellow-300',
        label: 'Revisión Coordinador' 
      },
      pendiente: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        border: 'border-blue-300',
        label: 'Pendiente' 
      },
      aprobada: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        border: 'border-green-300',
        label: 'Aprobada' 
      },
      rechazada: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        border: 'border-red-300',
        label: 'Rechazada' 
      }
    };
    return estilos[estado] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      border: 'border-gray-300',
      label: estado 
    };
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ 
          margin: '0 0 10px 0', 
          color: '#0a3274', 
          fontSize: '28px', 
          fontWeight: '600' 
        }}>
          <i className="fas fa-envelope-open-text me-2"></i>
          Gestión de Solicitudes
        </h2>
      </div>

      {/* Tabla de solicitudes */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '25px',
        overflow: 'hidden'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          color: '#0a3274',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Listado de Solicitudes
        </h3>

        {solicitudes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <i className="fas fa-inbox" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}></i>
            <p style={{ fontSize: '16px' }}>No tienes solicitudes enviadas aún</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              Ve a "Mis ofertas" y envía una oferta a revisión
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#6b7280',
                    fontSize: '13px',
                    textTransform: 'uppercase'
                  }}>
                    Oferta
                  </th>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#6b7280',
                    fontSize: '13px',
                    textTransform: 'uppercase'
                  }}>
                    Estado
                  </th>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#6b7280',
                    fontSize: '13px',
                    textTransform: 'uppercase'
                  }}>
                    Fecha Creación
                  </th>
                  <th style={{ 
                    padding: '12px 15px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#6b7280',
                    fontSize: '13px',
                    textTransform: 'uppercase'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => {
                  const badge = getBadgeEstado(sol.estado);
                  return (
                    <tr 
                      key={sol._id} 
                      style={{ borderBottom: '1px solid #f3f4f6' }}
                    >
                      {/* Oferta */}
                      <td style={{ padding: '15px' }}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#1f2937', 
                          marginBottom: '5px',
                          fontSize: '14px'
                        }}>
                          {sol.oferta?.programa?.nombre || 'Sin programa'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          <i className="fas fa-user me-1"></i>
                          {sol.solicitante?.nombre || sol.solicitante?.username || 'N/A'}
                        </div>
                      </td>

                      {/* Estado */}
                      <td style={{ padding: '15px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: badge.bg.replace('bg-', ''),
                            color: badge.text.replace('text-', ''),
                            border: `1px solid ${badge.border.replace('border-', '')}`
                          }}>
                            {badge.label}
                          </span>
                        </div>
                        {sol.estado === 'rechazada' && sol.motivoRechazo && (
                          <div style={{
                            fontSize: '12px',
                            color: '#dc2626',
                            marginTop: '5px'
                          }}>
                            <strong>Motivo:</strong> {sol.motivoRechazo}
                          </div>
                        )}
                      </td>

                      {/* Fecha Creación */}
                      <td style={{ padding: '15px', fontSize: '14px', color: '#4b5563' }}>
                        {formatearFecha(sol.createdAt)}
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            title="Ver detalles"
                            style={{
                              background: 'white',
                              border: '2px solid #3b82f6',
                              color: '#3b82f6',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#3b82f6';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#3b82f6';
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            title="Descargar documento"
                            style={{
                              background: 'white',
                              border: '2px solid #10b981',
                              color: '#10b981',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#10b981';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#10b981';
                            }}
                          >
                            <i className="fas fa-file-download"></i>
                          </button>
                          <button
                            title="Eliminar"
                            style={{
                              background: 'white',
                              border: '2px solid #ef4444',
                              color: '#ef4444',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudesInstructor;