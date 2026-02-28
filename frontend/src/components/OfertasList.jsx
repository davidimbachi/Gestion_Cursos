import React, { useState, useEffect } from 'react';
import { listarOfertas } from '../services/api';

const OfertasList = () => {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ofertaEditando, setOfertaEditando] = useState(null);
  const [formData, setFormData] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [enviando, setEnviando] = useState(false); // ← NUEVO: Estado para botón enviar

  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    try {
      setCargando(true);
      const data = await listarOfertas();
      setOfertas(data);
      if (data.length > 0) {
        setOfertaSeleccionada(data[0]);
      }
      console.log('✅ Ofertas cargadas:', data.length);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('No se pudieron cargar las ofertas');
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('error', 'Error al cargar ofertas');
      }
    } finally {
      setCargando(false);
    }
  };

  // ← NUEVA FUNCIÓN: Enviar oferta a solicitud
  const handleEnviarOferta = async () => {
    if (!ofertaSeleccionada) return;
    
    if (!confirm('¿Estás seguro de enviar esta oferta a revisión del coordinador?\n\nUna vez enviada, no podrás editarla.')) {
      return;
    }
    
    try {
      setEnviando(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/ofertas/${ofertaSeleccionada._id}/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Actualizar la oferta en la lista
        const ofertasActualizadas = ofertas.map(o => 
          o._id === ofertaSeleccionada._id ? data.oferta : o
        );
        setOfertas(ofertasActualizadas);
        setOfertaSeleccionada(data.oferta);
        
        if (window.mostrarNotificacion) {
          window.mostrarNotificacion('success', '✅ Oferta enviada a revisión');
        } else {
          alert('✅ Oferta enviada a revisión del coordinador');
        }
      } else {
        throw new Error(data.msg || 'Error al enviar');
      }
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('error', `❌ ${error.message}`);
      } else {
        alert(`❌ Error: ${error.message}`);
      }
    } finally {
      setEnviando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatearFechaCorta = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  // === FUNCIONES DE EDICIÓN ===
  const abrirEdicion = (oferta) => {
    console.log('🔵 [abrirEdicion] Abriendo modal para oferta:', oferta._id);
    setOfertaEditando(oferta);
    setFormData({
      codigo_ficha: oferta.codigo_ficha || '',
      cupo: oferta.cupo || '',
      fecha_inicio: oferta.fecha_inicio ? new Date(oferta.fecha_inicio).toISOString().split('T')[0] : '',
      fecha_inscripcion: oferta.fecha_inscripcion ? new Date(oferta.fecha_inscripcion).toISOString().split('T')[0] : '',
      fecha_terminacion: oferta.fecha_terminacion ? new Date(oferta.fecha_terminacion).toISOString().split('T')[0] : '',
      modalidad_oferta: oferta.modalidad_oferta || '',
      tipo_oferta: oferta.tipo_oferta || '',
      estado_enviada: oferta.estado_enviada || false,
      programa: oferta.programa?._id || '',
    });
    setModoEdicion(true);
  };

  const cerrarEdicion = () => {
    setModoEdicion(false);
    setOfertaEditando(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const guardarCambios = async () => {
    console.log('🔴 [DEBUG] guardarCambios llamado');
    console.log('🔴 [DEBUG] ofertaEditando:', ofertaEditando);
    console.log('🔴 [DEBUG] ofertaEditando._id:', ofertaEditando?._id);
    console.log('🔴 [DEBUG] formData:', formData);
    try {
      setGuardando(true);
      const url = `http://localhost:4000/api/ofertas/${ofertaEditando._id}`;
      console.log('📤 [FETCH] Enviando petición PUT a:', url);
      console.log('📤 [FETCH] Body:', JSON.stringify(formData, null, 2));
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('📥 [RESPONSE] Status:', response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [RESPONSE] Error en la respuesta:', errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const ofertaActualizada = await response.json();
      console.log('✅ [RESPONSE] Oferta actualizada recibida:', ofertaActualizada);
      setOfertas(ofertas.map(o => o._id === ofertaActualizada._id ? ofertaActualizada : o));
      if (ofertaSeleccionada?._id === ofertaActualizada._id) {
        setOfertaSeleccionada(ofertaActualizada);
      }
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('success', '✅ Oferta actualizada correctamente');
      } else {
        alert('✅ Oferta actualizada correctamente');
      }
      cerrarEdicion();
    } catch (error) {
      console.error('❌ [ERROR] Error completo:', error);
      console.error('❌ [ERROR] Stack:', error.stack);
      if (window.mostrarNotificacion) {
        window.mostrarNotificacion('error', `❌ Error al guardar cambios: ${error.message}`);
      } else {
        alert(`❌ Error al guardar cambios: ${error.message}`);
      }
    } finally {
      setGuardando(false);
      console.log('🔴 [guardarCambios] PROCESO FINALIZADO');
    }
  };

  if (cargando) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p style={{ marginTop: '15px', color: '#666' }}>Cargando ofertas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc2626' }}></i>
        <p style={{ marginTop: '15px', color: '#dc2626' }}>{error}</p>
        <button onClick={cargarOfertas} className="btn btn-primary" style={{ marginTop: '15px' }}>
          <i className="fas fa-sync-alt me-2"></i>Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ padding: '0', maxWidth: '100%' }}>
      {/* Header simplificado - Solo título y total */}
      <div style={{
        background: 'linear-gradient(135deg, #0a3274 0%, #1e40af 100%)',
        padding: '30px',
        color: 'white',
        boxShadow: '0 4px 20px rgba(10, 50, 116, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
              <i className="fas fa-briefcase me-2"></i>Ofertas de Formación
            </h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Gestiona las ofertas de programas de formación
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '15px 30px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Total Ofertas</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{ofertas.length}</div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Vista dividida */}
      <div style={{ display: 'flex', height: 'calc(100vh - 180px)', minHeight: '500px' }}>
        {/* Lista de ofertas - 40% del ancho */}
        <div style={{
          width: '40%',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          background: '#f9fafb',
          padding: '20px'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: '#0a3274',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-list"></i>
            Listado de Ofertas
          </h3>
          {ofertas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.5 }}></i>
              <p>No hay ofertas registradas</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ofertas.map((oferta) => (
                <div
                  key={oferta._id}
                  onClick={() => setOfertaSeleccionada(oferta)}
                  style={{
                    background: ofertaSeleccionada?._id === oferta._id
                      ? 'linear-gradient(135deg, #0a3274, #1e40af)'
                      : 'white',
                    color: ofertaSeleccionada?._id === oferta._id ? 'white' : '#1f2937',
                    padding: '18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: ofertaSeleccionada?._id === oferta._id
                      ? '0 4px 15px rgba(10, 50, 116, 0.3)'
                      : '0 2px 8px rgba(0,0,0,0.08)',
                    border: `2px solid ${ofertaSeleccionada?._id === oferta._id ? '#0a3274' : 'transparent'}`
                  }}
                  onMouseEnter={(e) => {
                    if (ofertaSeleccionada?._id !== oferta._id) {
                      e.currentTarget.style.transform = 'translateX(5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (ofertaSeleccionada?._id !== oferta._id) {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                    {oferta.codigo_ficha || 'Sin ficha'}
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '6px', opacity: 0.9 }}>
                    <i className="fas fa-book me-1"></i>
                    {oferta.programa?.nombre || 'Sin programa'}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    <i className="fas fa-calendar me-1"></i>
                    Inicio: {formatearFecha(oferta.fecha_inicio)}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '6px' }}>
                    <i className="fas fa-users me-1"></i>
                    {oferta.cupo} cupos disponibles
                  </div>
                  {/* Badge de estado */}
                  {oferta.estado_enviada && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#16a34a',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className="fas fa-check-circle"></i>
                      Enviada
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalle de oferta seleccionada - 60% del ancho */}
        <div style={{
          width: '60%',
          overflowY: 'auto',
          padding: '30px',
          background: 'white',
          position: 'relative'
        }}>
          {ofertaSeleccionada ? (
            <div>
              {/* === BOTÓN EDITAR === */}
              <button
                onClick={() => abrirEdicion(ofertaSeleccionada)}
                disabled={ofertaSeleccionada.estado_enviada}
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '30px',
                  background: ofertaSeleccionada.estado_enviada 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: ofertaSeleccionada.estado_enviada ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.3s ease',
                  zIndex: 10,
                  opacity: ofertaSeleccionada.estado_enviada ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!ofertaSeleccionada.estado_enviada) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(245, 158, 11, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(245, 158, 11, 0.3)';
                }}
              >
                <i className="fas fa-edit"></i>
                Editar
              </button>

              {/* Header del detalle */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                padding: '25px',
                borderRadius: '12px',
                marginBottom: '25px',
                border: '2px solid #3b82f6',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{
                      margin: '0 0 10px 0',
                      color: '#0a3274',
                      fontSize: '24px',
                      fontWeight: '600'
                    }}>
                      <i className="fas fa-briefcase me-2"></i>Detalles de la Oferta
                    </h3>
                  </div>
                </div>
              </div>

              {/* === SECCIÓN: INFORMACIÓN DEL PROGRAMA === */}
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{
                  color: '#0a3274',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-graduation-cap"></i>
                  Información del Programa
                </h4>
                {/* Tarjeta principal del programa */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  marginBottom: '15px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                      <i className="fas fa-book me-1"></i> Nombre del Programa
                    </div>
                    <div style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500', lineHeight: 1.4 }}>
                      {ofertaSeleccionada.programa?.nombre || 'Sin programa'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 150px' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                        <i className="fas fa-layer-group me-1"></i> Versión
                      </div>
                      <div style={{ fontSize: '16px', color: '#0a3274', fontWeight: '600' }}>
                        v{ofertaSeleccionada.programa?.version || 'N/A'}
                      </div>
                    </div>
                    <div style={{ flex: '1 1 150px' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                        <i className="fas fa-clock me-1"></i> Duración Total
                      </div>
                      <div style={{ fontSize: '16px', color: '#0a3274', fontWeight: '600' }}>
                        {ofertaSeleccionada.programa?.duracion ? `${ofertaSeleccionada.programa.duracion} horas` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Nivel, línea tecnológica y red */}
                {(ofertaSeleccionada.programa?.nivel_formacion ||
                  ofertaSeleccionada.programa?.linea_tecnologica ||
                  ofertaSeleccionada.programa?.red_conocimiento) && (
                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'
                  }}>
                    {ofertaSeleccionada.programa?.nivel_formacion && (
                      <div style={{ marginBottom: '10px', fontSize: '13px' }}>
                        <strong style={{ color: '#0a3274' }}>
                          <i className="fas fa-award me-1"></i> Nivel:
                        </strong>
                        <span style={{ color: '#4b5563', marginLeft: '8px' }}>
                          {ofertaSeleccionada.programa.nivel_formacion.nombre}
                        </span>
                      </div>
                    )}
                    {ofertaSeleccionada.programa?.linea_tecnologica && (
                      <div style={{ marginBottom: '10px', fontSize: '13px' }}>
                        <strong style={{ color: '#0a3274' }}>
                          <i className="fas fa-microchip me-1"></i> Línea Tecnológica:
                        </strong>
                        <span style={{ color: '#4b5563', marginLeft: '8px' }}>
                          {ofertaSeleccionada.programa.linea_tecnologica.nombre}
                        </span>
                      </div>
                    )}
                    {ofertaSeleccionada.programa?.red_conocimiento && (
                      <div style={{ fontSize: '13px' }}>
                        <strong style={{ color: '#0a3274' }}>
                          <i className="fas fa-network-wired me-1"></i> Red de Conocimiento:
                        </strong>
                        <span style={{ color: '#4b5563', marginLeft: '8px' }}>
                          {ofertaSeleccionada.programa.red_conocimiento.nombre}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* === SECCIÓN: UBICACIÓN === */}
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{
                  color: '#0a3274',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-map-marker-alt"></i>
                  Ubicación
                </h4>
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6'
                }}>
                  {/* Centro Regional SENA */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0a3274, #1e40af)',
                    color: 'white',
                    padding: '18px 24px',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    boxShadow: '0 4px 12px rgba(10, 50, 116, 0.3)'
                  }}>
                    <img
                      src="/img/logo_sena.png"
                      alt="SENA"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'white',
                        borderRadius: '8px',
                        padding: '5px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '3px' }}>
                        Centro Regional
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700' }}>
                        Centro Regional Cauca, SENA
                      </div>
                    </div>
                  </div>
                  {/* Sede específica */}
                  {ofertaSeleccionada.lugar?.ambiente && (
                    <div style={{
                      background: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <i className="fas fa-building" style={{ color: '#0a3274', fontSize: '18px' }}></i>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                          Sede
                        </div>
                        <div style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500' }}>
                          {ofertaSeleccionada.lugar.ambiente}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Dirección */}
                  {ofertaSeleccionada.lugar?.direccion && (
                    <div style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      marginBottom: '15px',
                      padding: '12px',
                      background: 'white',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <i className="fas fa-street-view" style={{ color: '#0a3274', marginTop: '3px' }}></i>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '3px' }}>
                          Dirección
                        </div>
                        {ofertaSeleccionada.lugar.direccion}
                      </div>
                    </div>
                  )}
                  {/* Departamento y Municipio */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {ofertaSeleccionada.lugar?.departamento?.nombre && (
                      <div style={{
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 3px 10px rgba(220, 38, 38, 0.3)',
                        flex: '1 1 120px'
                      }}>
                        <i className="fas fa-map-marked-alt"></i>
                        <div>
                          <div style={{ fontSize: '10px', opacity: 0.9 }}>Departamento</div>
                          <div>{ofertaSeleccionada.lugar.departamento.nombre}</div>
                        </div>
                      </div>
                    )}
                    {ofertaSeleccionada.lugar?.municipio?.nombre && (
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
                        flex: '1 1 120px'
                      }}>
                        <i className="fas fa-city"></i>
                        <div>
                          <div style={{ fontSize: '10px', opacity: 0.9 }}>Municipio</div>
                          <div>{ofertaSeleccionada.lugar.municipio.nombre}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ SECCIÓN: Detalles de la Oferta */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                padding: '25px',
                borderRadius: '12px',
                marginBottom: '25px'
              }}>
                <h4 style={{
                  color: '#0a3274',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-chart-bar"></i>
                  Detalles de la Oferta
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                      Modalidad
                    </div>
                    <div style={{ fontSize: '18px', color: '#0a3274', fontWeight: '700' }}>
                      {ofertaSeleccionada.modalidad_oferta}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                      Tipo
                    </div>
                    <div style={{ fontSize: '18px', color: '#0a3274', fontWeight: '700' }}>
                      {ofertaSeleccionada.tipo_oferta}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                      Cupos
                    </div>
                    <div style={{ fontSize: '24px', color: '#0a3274', fontWeight: '700' }}>
                      {ofertaSeleccionada.cupo}
                    </div>
                  </div>
                </div>
              </div>

              {/* === SECCIÓN: CRONOGRAMA === */}
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  color: '#0a3274',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-calendar-alt"></i>
                  Cronograma
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #86efac'
                  }}>
                    <i className="fas fa-play-circle" style={{ color: '#10b981', fontSize: '20px' }}></i>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
                        Fecha de Inicio
                      </div>
                      <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>
                        {formatearFecha(ofertaSeleccionada.fecha_inicio)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: '#fffbeb',
                    borderRadius: '8px',
                    border: '1px solid #fcd34d'
                  }}>
                    <i className="fas fa-user-plus" style={{ color: '#f59e0b', fontSize: '20px' }}></i>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
                        Fecha Límite de Inscripción
                      </div>
                      <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>
                        {formatearFecha(ofertaSeleccionada.fecha_inscripcion)}
                      </div>
                    </div>
                  </div>
                  {ofertaSeleccionada.fecha_terminacion && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: '#fef2f2',
                      borderRadius: '8px',
                      border: '1px solid #fca5a5'
                    }}>
                      <i className="fas fa-stop-circle" style={{ color: '#dc2626', fontSize: '20px' }}></i>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
                          Fecha de Terminación
                        </div>
                        <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>
                          {formatearFecha(ofertaSeleccionada.fecha_terminacion)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* === SECCIÓN: DOCUMENTOS === */}
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  color: '#0a3274',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-file-pdf"></i>
                  Documentos de la Oferta
                </h4>
                {/* Grid de documentos funcionales */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px'
                }}>
                  {/* Documento 1: Ficha de caracterización */}
                  <div
                    onClick={() => { }}
                    style={{
                      background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                      padding: '25px 15px',
                      borderRadius: '12px',
                      border: '2px solid #fecaca',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    <i className="fas fa-file-pdf" style={{
                      fontSize: '48px',
                      color: '#dc2626',
                      marginBottom: '12px'
                    }}></i>
                    <div style={{
                      fontSize: '13px',
                      color: '#1f2937',
                      fontWeight: '600',
                      marginTop: '8px',
                      lineHeight: 1.3
                    }}>
                      Ficha de caracterización
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '6px'
                    }}>
                      PDF
                    </div>
                  </div>
                  {/* Documento 2: Ver Masivo Aprendices */}
                  <div
                    onClick={() => { }}
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      padding: '25px 15px',
                      borderRadius: '12px',
                      border: '2px solid #86efac',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.1)';
                    }}
                  >
                    <i className="fas fa-file-excel" style={{
                      fontSize: '48px',
                      color: '#16a34a',
                      marginBottom: '12px'
                    }}></i>
                    <div style={{
                      fontSize: '13px',
                      color: '#1f2937',
                      fontWeight: '600',
                      marginTop: '8px',
                      lineHeight: 1.3
                    }}>
                      Ver Masivo Aprendices
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '6px'
                    }}>
                      Excel/CSV
                    </div>
                  </div>
                  {/* Documento 3: Documentos de identificación */}
                  <div
                    onClick={() => { }}
                    style={{
                      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                      padding: '25px 15px',
                      borderRadius: '12px',
                      border: '2px solid #d1d5db',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(107, 114, 128, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(107, 114, 128, 0.1)';
                    }}
                  >
                    <i className="fas fa-id-card" style={{
                      fontSize: '48px',
                      color: '#6b7280',
                      marginBottom: '12px'
                    }}></i>
                    <div style={{
                      fontSize: '13px',
                      color: '#1f2937',
                      fontWeight: '600',
                      marginTop: '8px',
                      lineHeight: 1.3
                    }}>
                      Documentos de identificación
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '6px'
                    }}>
                      PDF
                    </div>
                  </div>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center',
                  marginTop: '15px',
                  fontStyle: 'italic'
                }}>
                  💡 Haz clic en cualquier documento para descargarlo con la información de esta oferta
                </p>
              </div>

              {/* === ESPACIO === */}
              <div style={{ height: '20px' }}></div>

              {/* === BOTÓN ENVIAR (NUEVO) === */}
              {!ofertaSeleccionada.estado_enviada ? (
                <button
                  onClick={handleEnviarOferta}
                  disabled={enviando}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: enviando ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!enviando) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  {enviando ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Enviar a Revisión del Coordinador
                    </>
                  )}
                </button>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '2px solid #10b981'
                }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '32px', color: '#10b981', marginBottom: '10px' }}></i>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#065f46' }}>
                    ✅ Esta oferta ya fue enviada a revisión
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857', marginTop: '5px' }}>
                    El coordinador la está evaluando
                  </div>
                </div>
              )}

              {/* === TOKEN DE INSCRIPCIÓN === */}
              {ofertaSeleccionada.token_inscripcion && (
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                  marginTop: '20px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#1e40af',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-link"></i>
                    Enlace de Inscripción
                  </div>
                  <a
                    href={`http://localhost:3000/ofertas`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px dashed #3b82f6',
                      textDecoration: 'none',
                      color: '#1e40af',
                      fontWeight: '500',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.borderColor = '#1e40af';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                  >
                    <i className="fas fa-external-link-alt" style={{ fontSize: '14px' }}></i>
                    <span style={{ flex: 1 }}>
                      http://localhost:3000/ofertas/{ofertaSeleccionada.token_inscripcion}
                    </span>
                  </a>
                  <button
                    onClick={() => {
                      const link = `http://localhost:3000/ofertas`;
                      navigator.clipboard.writeText(link).then(() => {
                        if (window.mostrarNotificacion) {
                          window.mostrarNotificacion('success', 'Enlace copiado al portapapeles');
                        } else {
                          alert('✅ Enlace copiado');
                        }
                      }).catch(() => {
                        const textArea = document.createElement('textarea');
                        textArea.value = link;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        if (window.mostrarNotificacion) {
                          window.mostrarNotificacion('success', 'Enlace copiado al portapapeles');
                        } else {
                          alert('✅ Enlace copiado');
                        }
                      });
                    }}
                    style={{
                      marginTop: '10px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    <i className="fas fa-copy"></i>
                    Copiar enlace
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <i className="fas fa-mouse-pointer" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}></i>
              <p style={{ fontSize: '16px' }}>Selecciona una oferta para ver los detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* === MODAL DE EDICIÓN === */}
      {modoEdicion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#0a3274', fontSize: '20px', fontWeight: '600' }}>
              <i className="fas fa-edit me-2"></i>Editar Oferta
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#1f2937', fontSize: '13px' }}>
                  <i className="fas fa-code me-1"></i> Código de Ficha
                </label>
                <input type="text" name="codigo_ficha" value={formData.codigo_ficha || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#1f2937', fontSize: '13px' }}>
                  <i className="fas fa-users me-1"></i> Cupos
                </label>
                <input type="number" name="cupo" value={formData.cupo || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#1f2937', fontSize: '13px' }}>
                  <i className="fas fa-calendar me-1"></i> Fecha de Inicio
                </label>
                <input type="date" name="fecha_inicio" value={formData.fecha_inicio || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#1f2937', fontSize: '13px' }}>
                  <i className="fas fa-calendar-check me-1"></i> Fecha Límite de Inscripción
                </label>
                <input type="date" name="fecha_inscripcion" value={formData.fecha_inscripcion || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#1f2937', fontSize: '13px' }}>
                  <i className="fas fa-graduation-cap me-1"></i> Modalidad
                </label>
                <select name="modalidad_oferta" value={formData.modalidad_oferta || ''} onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}>
                  <option value="">Seleccione...</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f3f4f6', borderRadius: '6px' }}>
                <input type="checkbox" name="estado_enviada" checked={formData.estado_enviada || false} onChange={handleInputChange} id="estado_enviada" style={{ width: '18px', height: '18px' }} />
                <label htmlFor="estado_enviada" style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', cursor: 'pointer' }}>
                  <i className="fas fa-paper-plane me-1"></i> Marca como Enviada
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'flex-end' }}>
              <button onClick={cerrarEdicion} disabled={guardando}
                style={{ background: '#6b7280', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: guardando ? 'not-allowed' : 'pointer', opacity: guardando ? 0.6 : 1 }}>
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
              <button onClick={guardarCambios} disabled={guardando}
                style={{ background: guardando ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: guardando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {guardando ? <><i className="fas fa-spinner fa-spin"></i> Guardando...</> : <><i className="fas fa-save"></i> Guardar Cambios</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfertasList;