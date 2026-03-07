/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SolicitudesInstructor = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [modalMode, setModalMode] = useState('docs'); // 'docs' o 'comments'
  const navigate = useNavigate();

  const abrirModal = async (solicitud, mode = 'docs') => {
    setModalMode(mode);
    try {
      // solicitar datos actualizados desde el servidor (comentarios etc.)
      const respuesta = await api.get(`/solicitudes-ofertas/${solicitud._id}`);
      setSolicitudSeleccionada(respuesta.data);
    } catch (err) {
      console.error('Error cargando solicitud:', err);
      // si falla, usamos el objeto que ya teníamos
      setSolicitudSeleccionada(solicitud);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  const descargarFicha = async () => {
    if (!solicitudSeleccionada?.oferta?._id) {
      alert('No se encontró la ID de la oferta');
      return;
    }
    try {
      const respuesta = await api.get(`/ofertas/${solicitudSeleccionada.oferta._id}/ficha`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([respuesta.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ficha_${solicitudSeleccionada.oferta._id}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error descargando ficha:', err);
      alert('Error al descargar la ficha');
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.rol?.toLowerCase() !== 'instructor') {
      // si no es instructor, redirigir a su sección correspondiente
      console.warn('No autorizado para ver esta página. rol actual:', usuario.rol);
      if (usuario.rol?.toLowerCase() === 'coordinador') {
        // coordinadores tienen su propio panel de solicitudes
        navigate('/coordinador/solicitudes');
      } else {
        navigate('/inicio');
      }
      return;
    }
    cargarSolicitudes();
  }, [navigate]);

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
      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
        Si ves este mensaje siendo coordinador, utiliza la ruta "Coordinador → Solicitudes" en el menú.
      </p>
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
                            onClick={() => abrirModal(sol, 'docs')}
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
                            title="Comentarios del coordinador"
                            onClick={() => abrirModal(sol, 'comments')}
                            style={{
                              background: 'white',
                              border: '2px solid #f59e0b',
                              color: '#f59e0b',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f59e0b';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#f59e0b';
                            }}
                          >
                            <i className="fas fa-comments"></i>
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

      {/* Modal */}
      {modalAbierto && solicitudSeleccionada && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
          }}>
            {/* Header del modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#0a3274', fontSize: '20px' }}>
                <i className={modalMode === 'comments' ? 'fas fa-comments me-2' : 'fas fa-file-alt me-2'}></i>
                {modalMode === 'comments' ? 'Observaciones de la Solicitud' : 'Documentos de la Solicitud'}
              </h2>
              <button
                onClick={cerrarModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Info de la solicitud (oculta completamente en modo comentarios) */}
            {modalMode !== 'comments' && (
              <div style={{
                padding: '15px',
                background: '#f3f4f6',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#6b7280' }}>
                  <strong>Programa:</strong> {solicitudSeleccionada.oferta?.programa?.nombre || 'Sin programa'}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#6b7280' }}>
                  <strong>Solicitante:</strong> {solicitudSeleccionada.solicitante?.nombre || 'N/A'}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#6b7280' }}>
                  <strong>Estado:</strong> {solicitudSeleccionada.estado?.toUpperCase()}
                </p>
              </div>
            )}
            {/* Comentario coordinador */}
            <div style={{ marginTop: modalMode === 'comments' ? '0' : '10px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '4px'
              }}>
                Observaciones del coordinador
              </label>
              <textarea
                readOnly
                value={solicitudSeleccionada.observaciones || ''}
                placeholder="No hay observaciones"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  resize: 'vertical',
                  padding: '8px',
                  fontSize: '13px',
                  color: '#1f2937',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: '#ffffff'
                }}
              />
            </div>
            {modalMode !== 'comments' && solicitudSeleccionada.motivoRechazo && (
              <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#dc2626' }}>
                <strong>Motivo rechazo:</strong> {solicitudSeleccionada.motivoRechazo}
              </p>
            )}

            {/* mostrar documentos solo cuando no estamos en modo comments */}
            {modalMode !== 'comments' && (
              <>
                {/* Documentos disponibles */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#0a3274', fontSize: '16px', marginBottom: '15px' }}>
                    Documentos Disponibles:
                  </h3>

                  {/* Ficha de Caracterización */}
                  <div style={{
                    padding: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <i className="fas fa-file-word me-2" style={{ color: '#3b82f6' }}></i>
                      <strong style={{ color: '#1f2937' }}>Ficha de Caracterización</strong>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        Documento Word con detalles de la oferta
                      </p>
                    </div>
                    <button
                      onClick={descargarFicha}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        marginLeft: '10px'
                      }}
                    >
                      <i className="fas fa-download me-1"></i>
                      Descargar
                    </button>
                  </div>

                  {/* Carta de Solicitud */}
                  <div style={{
                    padding: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <div>
                      <i className="fas fa-file-pdf me-2" style={{ color: '#ef4444' }}></i>
                      <strong style={{ color: '#1f2937' }}>Carta de Solicitud</strong>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        Documento PDF con la solicitud
                      </p>
                    </div>
                    <button
                      disabled={true}
                      style={{
                        background: '#d1d5db',
                        color: '#6b7280',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'not-allowed',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        marginLeft: '10px'
                      }}
                    >
                      <i className="fas fa-download me-1"></i>
                      No disponible
                    </button>
                  </div>

                  {/* Documentos de Aprendices */}
                  <div style={{
                    padding: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <div>
                      <i className="fas fa-folder me-2" style={{ color: '#f59e0b' }}></i>
                      <strong style={{ color: '#1f2937' }}>Documentos de Aprendices</strong>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        Carpeta con archivos de aprendices
                      </p>
                    </div>
                    <button
                      disabled={true}
                      style={{
                        background: '#d1d5db',
                        color: '#6b7280',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'not-allowed',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        marginLeft: '10px'
                      }}
                    >
                      <i className="fas fa-download me-1"></i>
                      No disponible
                    </button>
                  </div>
                </div>

                {/* Botón cerrar */}
                <button
                  onClick={cerrarModal}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                >
                  Cerrar
                </button>
              </>
            )}

            {modalMode === 'comments' && (
              <button
                onClick={cerrarModal}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#e5e7eb',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                }}
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesInstructor;