import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SolicitudesCoordinador = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarSolicitudes();
  }, [filtroEstado]);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const url = filtroEstado === 'todos' 
        ? '/solicitudes-ofertas/coordinador'
        : `/solicitudes-ofertas/coordinador?estado=${filtroEstado}`;
      
      const respuesta = await api.get(url);
      setSolicitudes(respuesta.data);
      console.log('✅ Solicitudes cargadas:', respuesta.data.length);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('No se pudieron cargar las solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const aprobarSolicitud = async (id) => {
    if (!confirm('¿Estás seguro de APROBAR esta solicitud?')) return;
    
    try {
      await api.put(`/solicitudes-ofertas/${id}/aprobar`);
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('success', '✅ Solicitud aprobada');
      } else {
        alert('✅ Solicitud aprobada correctamente');
      }
      cargarSolicitudes();
    } catch (err) {
      console.error('❌ Error al aprobar:', err);
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('error', 'Error al aprobar la solicitud');
      } else {
        alert('❌ Error al aprobar: ' + err.message);
      }
    }
  };

  const rechazarSolicitud = async (id) => {
    const motivo = prompt('Motivo del rechazo (opcional):');
    if (motivo === null) return; // Usuario canceló
    
    try {
      await api.put(`/solicitudes-ofertas/${id}/rechazar`, { motivo: motivo || 'Sin motivo especificado' });
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('success', '❌ Solicitud rechazada');
      } else {
        alert('❌ Solicitud rechazada');
      }
      cargarSolicitudes();
    } catch (err) {
      console.error('❌ Error al rechazar:', err);
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('error', 'Error al rechazar la solicitud');
      } else {
        alert('❌ Error al rechazar: ' + err.message);
      }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              <i className="fas fa-inbox me-2"></i>
              Gestión de Solicitudes
            </h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
              Revisa y aprueba las ofertas de los instructores
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '15px 25px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '12px', marginBottom: '3px' }}>Total</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{solicitudes.length}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <label style={{ fontWeight: '600', marginRight: '10px', color: '#0a3274' }}>
          <i className="fas fa-filter me-1"></i>Filtrar por estado:
        </label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            padding: '8px 15px',
            borderRadius: '6px',
            border: '2px solid #e5e7eb',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="todos">Todas</option>
          <option value="revision">En revisión</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {/* Lista de solicitudes */}
      {solicitudes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <i className="fas fa-inbox" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}></i>
          <p style={{ fontSize: '16px' }}>No hay solicitudes {filtroEstado !== 'todos' ? `con estado "${filtroEstado}"` : ''}</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          {/* Tabla */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Oferta</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Instructor</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Estado</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Fecha</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => {
                  const badge = getBadgeEstado(sol.estado);
                  return (
                    <tr key={sol._id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: '600', color: '#0a3274', marginBottom: '5px' }}>
                          {sol.oferta?.programa?.nombre || 'Sin programa'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          <i className="fas fa-hashtag me-1"></i>Ficha: {sol.oferta?.codigo_ficha || 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontSize: '14px', color: '#1f2937' }}>
                          {sol.solicitante?.nombre || sol.solicitante?.username || 'N/A'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {sol.solicitante?.email || ''}
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }} className={`${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '15px', fontSize: '13px', color: '#6b7280' }}>
                        {new Date(sol.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {sol.estado === 'revision' || sol.estado === 'pendiente' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => aprobarSolicitud(sol._id)}
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                              title="Aprobar"
                            >
                              <i className="fas fa-check"></i> Aprobar
                            </button>
                            <button
                              onClick={() => rechazarSolicitud(sol._id)}
                              style={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                              title="Rechazar"
                            >
                              <i className="fas fa-times"></i> Rechazar
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                            Procesada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesCoordinador;