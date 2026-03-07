/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SolicitudesCoordinador = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarObservaciones, setMostrarObservaciones] = useState(false);
  const [observacionesTexto, setObservacionesTexto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.rol?.toLowerCase() !== 'coordinador') {
      console.warn('Acceso no permito a coordinador. rol actual:', usuario.rol);
      navigate('/inicio');
      return;
    }
    cargarSolicitudes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroEstado, navigate]);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const url = filtroEstado === 'todos' 
        ? '/solicitudes-ofertas/coordinador'
        : `/solicitudes-ofertas/coordinador?estado=${filtroEstado}`;
      
      const respuesta = await api.get(url);
      setSolicitudes(respuesta.data);
      console.log('✅ Solicitudes cargadas:', respuesta.data.length);
      setError(null);
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Status:', err.response?.status);
      console.error('❌ Data:', err.response?.data);
      
      const mensajeError = err.response?.data?.msg || err.message || 'No se pudieron cargar las solicitudes';
      setError(`Error: ${mensajeError}`);
      
      // Si es error 403, mostrar más detalles
      if (err.response?.status === 403) {
        console.error('❌ Acceso denegado. Rol actual:', err.response?.data?.rolActual);
        setError(`Acceso denegado: ${err.response?.data?.msg}. Tu rol es: ${err.response?.data?.rolActual}`);
      }
    } finally {
      setCargando(false);
    }
  };

  const aprobarSolicitud = async (id) => {
    if (!window.confirm('¿Estás seguro de APROBAR esta solicitud?')) return;
    
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
    const motivo = window.prompt('Motivo del rechazo (opcional):');
    if (motivo === null) return;
    
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

  // Abrir modal de detalles
  const abrirDetalles = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setMostrarDetalles(true);
  };

  // Abrir modal de observaciones
  const abrirObservaciones = (solicitud) => {
    console.log('Abriendo modal de observaciones para:', solicitud._id);
    setSolicitudSeleccionada(solicitud);
    setObservacionesTexto(solicitud.observaciones || '');
    setMostrarObservaciones(true);
  };

  // Guardar observaciones
  const guardarObservaciones = async () => {
    console.log('Guardando observaciones:', observacionesTexto);
    if (!solicitudSeleccionada) {
      console.error('No hay solicitud seleccionada');
      return;
    }
    try {
      await api.put(`/solicitudes-ofertas/${solicitudSeleccionada._id}`, {
        observaciones: observacionesTexto
      });
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('success', '✅ Observaciones guardadas');
      } else {
        alert('✅ Observaciones guardadas');
      }
      setMostrarObservaciones(false);
      cargarSolicitudes();
    } catch (err) {
      console.error('❌ Error al guardar observaciones:', err);
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('error', 'Error al guardar observaciones');
      } else {
        alert('❌ Error: ' + err.message);
      }
    }
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
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc2626' }}></i>
        <p style={{ marginTop: '15px', color: '#dc2626', fontSize: '16px', fontWeight: '600' }}>{error}</p>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          Tu rol: <strong>{usuarioLocal.rol || 'No identificado'}</strong>
        </p>
        <button onClick={cargarSolicitudes} className="btn btn-primary" style={{ marginTop: '15px' }}>
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

      {/* Tabla */}
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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Oferta</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Fecha Creación</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Observaciones</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#0a3274', borderBottom: '2px solid #e5e7eb' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => {
                  return (
                    <tr key={sol._id} style={{ borderBottom: '1px solid #e5e7eb' }}
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
                      {/* Fecha Creación */}
                      <td style={{ padding: '15px', fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        <i className="fas fa-calendar me-2" style={{ color: '#0a3274' }}></i>
                        {formatearFecha(sol.createdAt)}
                      </td>

                      {/* Observaciones */}
                      <td style={{ padding: '15px' }}>
                        {sol.observaciones ? (
                          <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #86efac',
                            padding: '10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#166534',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            <i className="fas fa-check-circle me-1"></i>
                            {sol.observaciones.substring(0, 50)}...
                          </div>
                        ) : (
                          <div style={{
                            fontSize: '13px',
                            color: '#9ca3af',
                            fontStyle: 'italic'
                          }}>
                            Sin observaciones
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* 👁️ Ver Detalles */}
                          <button
                            onClick={() => abrirDetalles(sol)}
                            style={{
                              background: '#e0e7ff',
                              color: '#4f46e5',
                              border: 'none',
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            title="Ver detalles completos"
                            onMouseEnter={(e) => e.target.style.background = '#c7d2fe'}
                            onMouseLeave={(e) => e.target.style.background = '#e0e7ff'}
                          >
                            👁️
                          </button>

                          {/* 📝 Agregar Observaciones */}
                          <button
                            onClick={() => abrirObservaciones(sol)}
                            style={{
                              background: '#fef3c7',
                              color: '#b45309',
                              border: 'none',
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            title="Agregar observaciones"
                            onMouseEnter={(e) => e.target.style.background = '#fde68a'}
                            onMouseLeave={(e) => e.target.style.background = '#fef3c7'}
                          >
                            📝
                          </button>

                          {/* ✏️ Editar Estado */}
                          <button
                            onClick={() => alert('Funcionalidad de editar estado disponible próximamente.')}
                            style={{
                              background: '#dbeafe',
                              color: '#1e40af',
                              border: 'none',
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            title="Editar/Modificar estado"
                            onMouseEnter={(e) => e.target.style.background = '#bfdbfe'}
                            onMouseLeave={(e) => e.target.style.background = '#dbeafe'}
                          >
                            ✏️
                          </button>

                          {/* ✅ Aprobar / ❌ Rechazar */}
                          {sol.estado === 'revision' || sol.estado === 'pendiente' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => aprobarSolicitud(sol._id)}
                                style={{
                                  background: '#d1fae5',
                                  color: '#065f46',
                                  border: 'none',
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title="Aprobar solicitud"
                                onMouseEnter={(e) => e.target.style.background = '#a7f3d0'}
                                onMouseLeave={(e) => e.target.style.background = '#d1fae5'}
                              >
                                ✅
                              </button>
                              <button
                                onClick={() => rechazarSolicitud(sol._id)}
                                style={{
                                  background: '#fee2e2',
                                  color: '#991b1b',
                                  border: 'none',
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title="Rechazar solicitud"
                                onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                              >
                                ❌
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>
                              Procesada
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Detalles de la Oferta */}
      {mostrarDetalles && solicitudSeleccionada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setMostrarDetalles(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#0a3274' }}>
                📋 Detalles de la Oferta
              </h3>
              <button onClick={() => setMostrarDetalles(false)} style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}>
                ✕
              </button>
            </div>

            <div style={{ color: '#1f2937' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                  Programa
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#0a3274', marginTop: '5px' }}>
                  {solicitudSeleccionada.oferta?.programa?.nombre || 'N/A'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                  Código de Ficha
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  {solicitudSeleccionada.oferta?.codigo_ficha || 'N/A'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                  Cupo
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  {solicitudSeleccionada.oferta?.cupo || 'N/A'} aprendices
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                  Modalidad
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  {solicitudSeleccionada.oferta?.modalidad_oferta || 'N/A'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                  Fechas
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  <div>Inscripción: {formatearFecha(solicitudSeleccionada.oferta?.fecha_inscripcion)}</div>
                  <div>Inicio: {formatearFecha(solicitudSeleccionada.oferta?.fecha_inicio)}</div>
                  <div>Terminación: {formatearFecha(solicitudSeleccionada.oferta?.fecha_terminacion)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>
                  Instructor
                </div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  <div><strong>{solicitudSeleccionada.solicitante?.nombre || 'N/A'}</strong></div>
                  <div>{solicitudSeleccionada.solicitante?.email}</div>
                </div>
              </div>

              <button onClick={() => setMostrarDetalles(false)} style={{
                background: 'linear-gradient(135deg, #0a3274, #1e40af)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                marginTop: '20px'
              }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Observaciones */}
      {mostrarObservaciones && solicitudSeleccionada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setMostrarObservaciones(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#0a3274' }}>
                📝 Agregar Observaciones
              </h3>
              <button onClick={() => setMostrarObservaciones(false)} style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '10px' }}>
                Observaciones:
              </label>
              <textarea
                value={observacionesTexto}
                onChange={(e) => setObservacionesTexto(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Arial, sans-serif',
                  minHeight: '120px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Escribe tus observaciones aquí..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setMostrarObservaciones(false)} style={{
                background: '#e5e7eb',
                color: '#1f2937',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Cancelar
              </button>
              <button onClick={guardarObservaciones} style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                💾 Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesCoordinador;