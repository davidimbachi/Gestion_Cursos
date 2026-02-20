import React, { useState, useEffect } from 'react';
import { listarOfertas } from '../services/api';

const OfertasList = () => {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

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

  // Calcular estadísticas
  const totalCupos = ofertas.reduce((sum, oferta) => sum + (oferta.cupo || 0), 0);
  const ofertasEnviadas = ofertas.filter(o => o.estado_enviada).length;
  const ofertasBorrador = ofertas.filter(o => !o.estado_enviada).length;

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
      {/* Header con estadísticas */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0a3274 0%, #1e40af 100%)',
        padding: '30px',
        color: 'white',
        boxShadow: '0 4px 20px rgba(10, 50, 116, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
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

        {/* Tarjetas de estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '20px', 
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>
              <i className="fas fa-users me-2"></i>Total Cupos
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalCupos}</div>
          </div>
          
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.3)', 
            padding: '20px', 
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              <i className="fas fa-check-circle me-2"></i>Enviadas
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{ofertasEnviadas}</div>
          </div>
          
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.3)', 
            padding: '20px', 
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              <i className="fas fa-clock me-2"></i>Borrador
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{ofertasBorrador}</div>
          </div>
          
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.3)', 
            padding: '20px', 
            borderRadius: '10px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              <i className="fas fa-percentage me-2"></i>% Enviadas
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {ofertas.length > 0 ? Math.round((ofertasEnviadas / ofertas.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Vista dividida */}
      <div style={{ display: 'flex', height: 'calc(100vh - 350px)', minHeight: '500px' }}>
        
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {oferta.codigo_ficha || 'Sin ficha'}
                    </div>
                    <span style={{
                      background: oferta.estado_enviada 
                        ? (ofertaSeleccionada?._id === oferta._id ? '#10b981' : '#d1fae5')
                        : (ofertaSeleccionada?._id === oferta._id ? '#f59e0b' : '#fef3c7'),
                      color: oferta.estado_enviada 
                        ? (ofertaSeleccionada?._id === oferta._id ? 'white' : '#059669')
                        : (ofertaSeleccionada?._id === oferta._id ? 'white' : '#d97706'),
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {oferta.estado_enviada ? 'ENVIADA' : 'BORRADOR'}
                    </span>
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
          background: 'white'
        }}>
          {ofertaSeleccionada ? (
            <div>
              {/* Header del detalle */}
              <div style={{ 
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                padding: '25px',
                borderRadius: '12px',
                marginBottom: '25px',
                border: '2px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: '#0a3274',
                      fontSize: '24px',
                      fontWeight: '600'
                    }}>
                      {ofertaSeleccionada.codigo_ficha || 'Sin ficha'}
                    </h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                      <i className="fas fa-calendar-plus me-2"></i>
                      Creada: {formatearFechaCorta(ofertaSeleccionada.createdAt)}
                    </p>
                  </div>
                  <div style={{
                    background: ofertaSeleccionada.estado_enviada 
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <i className={ofertaSeleccionada.estado_enviada ? 'fas fa-check-circle' : 'fas fa-clock'}></i>
                    {' '}{ofertaSeleccionada.estado_enviada ? 'Enviada' : 'Borrador'}
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
                      <i className="fas fa-code me-1"></i> Código del Programa
                    </div>
                    <div style={{ fontSize: '18px', color: '#0a3274', fontWeight: '700' }}>
                      {ofertaSeleccionada.programa?.codigo || 'N/A'}
                    </div>
                  </div>
                  
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

              {/* === SECCIÓN: UBICACIÓN (CENTRO REGIONAL CAUCA, SENA) === */}
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

              {/* === SECCIÓN: DETALLES DE LA OFERTA === */}
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

              {/* === SECCIÓN: TOKEN DE INSCRIPCIÓN (LINK CLICABLE + COPIAR) === */}
              {ofertaSeleccionada.token_inscripcion && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
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
                  
                  {/* Link clicable */}
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
                  
                  {/* Botón para copiar */}
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
                        // Fallback para navegadores antiguos
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
    </div>
  );
};

export default OfertasList;