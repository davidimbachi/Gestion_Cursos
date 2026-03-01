import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CrearOferta.css';

const API = 'http://localhost:4000/api';

const CrearOferta = () => {
  const [tabActiva, setTabActiva] = useState('programa');
  const [enviando, setEnviando]   = useState(false);
  const [errores, setErrores]     = useState({});
  const [notificacion, setNotificacion] = useState(null);

  const [duracion, setDuracion]                         = useState('');
  const [programas, setProgramas]                       = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [busquedaPrograma, setBusquedaPrograma]         = useState('');
  const [cargandoProgs, setCargandoProgs]               = useState(false);

  const [modalidadOferta, setModalidadOferta] = useState('REGULAR');
  const [tipoOferta, setTipoOferta]           = useState('ABIERTA');
  const [tiposOferta, setTiposOferta]         = useState([]);
  const [modalidades, setModalidades]         = useState([]);
  const [duracionesDisponibles, setDuracionesDisponibles] = useState([]);
  const [cupo, setCupo]                       = useState(25);
  const [fechaInicio, setFechaInicio]         = useState('');
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [codigoFicha, setCodigoFicha]         = useState('');
  const [codigoSolicitud, setCodigoSolicitud] = useState('');
  const [programasEspeciales, setProgramasEspeciales] = useState([]);
  const [programaEspecial, setProgramaEspecial] = useState('');
  const [programaInfo, setProgramaInfo]       = useState(null);

  const [empresasExistentes, setEmpresasExistentes] = useState([]);
  const [busquedaEmpresa, setBusquedaEmpresa]       = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [tiposEmpresa, setTiposEmpresa]             = useState([]);

  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento]   = useState('');
  const [municipios, setMunicipios]       = useState([]);
  const [municipio, setMunicipio]         = useState('');
  const [corregimientos, setCorregimientos] = useState([]);
  const [corregimiento, setCorregimiento] = useState('');
  const [ambiente, setAmbiente]           = useState('');
  const [direccion, setDireccion]         = useState('');

  const [sectores, setSectores]                     = useState([]);
  const [sectorSeleccionado, setSectorSeleccionado] = useState('');

  // HORARIO: { 'YYYY-MM-DD': { hora_inicio, hora_fin } }
  const [horarios, setHorarios] = useState({});
  const [mesCalendario, setMesCalendario] = useState(() => {
    const hoy = new Date();
    return { mes: hoy.getMonth(), anio: hoy.getFullYear() };
  });

  const [infoEmpresa, setInfoEmpresa] = useState({
    cual_convenio: '', nombre_empresa: '', nit_empresa: '',
    fecha_creacion: '', tipo_empresa: '', direccion_empresa: '',
    nombre_representante_legal: '', nombre_contacto: '',
    celular_contacto: '', correo_contacto: '', numero_empleados: '',
  });

  const updateEmpresa = (campo, valor) =>
    setInfoEmpresa(prev => ({ ...prev, [campo]: valor }));

  const infoEmpresaVacia = {
    cual_convenio: '', nombre_empresa: '', nit_empresa: '',
    fecha_creacion: '', tipo_empresa: '', direccion_empresa: '',
    nombre_representante_legal: '', nombre_contacto: '',
    celular_contacto: '', correo_contacto: '', numero_empleados: '',
  };

  const [infoCampesena, setInfoCampesena] = useState({
    nombre_empresa: '', nit_empresa: '', fecha_creacion: '', tipo_empresa: '',
    direccion_empresa: '', nombre_representante_legal: '', nombre_contacto: '',
    celular_contacto: '', correo_contacto: '', numero_empleados: '',
    inst_tecnico_nombre: '', inst_tecnico_correo: '', inst_tecnico_celular: '',
    inst_tecnico_mes1: '', inst_tecnico_mes2: '', inst_tecnico_mes3: '', inst_tecnico_mes4: '', inst_tecnico_mes5: '',
    inst_empresarial_nombre: '', inst_empresarial_correo: '', inst_empresarial_celular: '',
    inst_empresarial_mes1: '', inst_empresarial_mes2: '', inst_empresarial_mes3: '', inst_empresarial_mes4: '', inst_empresarial_mes5: '',
    inst_fullpopular_nombre: '', inst_fullpopular_correo: '', inst_fullpopular_celular: '',
    inst_fullpopular_mes1: '', inst_fullpopular_mes2: '',
  });

  const updateCampesena = (campo, valor) =>
    setInfoCampesena(prev => ({ ...prev, [campo]: valor }));

  const infoCampesenaVacia = {
    nombre_empresa: '', nit_empresa: '', fecha_creacion: '', tipo_empresa: '',
    direccion_empresa: '', nombre_representante_legal: '', nombre_contacto: '',
    celular_contacto: '', correo_contacto: '', numero_empleados: '',
    inst_tecnico_nombre: '', inst_tecnico_correo: '', inst_tecnico_celular: '',
    inst_tecnico_mes1: '', inst_tecnico_mes2: '', inst_tecnico_mes3: '', inst_tecnico_mes4: '', inst_tecnico_mes5: '',
    inst_empresarial_nombre: '', inst_empresarial_correo: '', inst_empresarial_celular: '',
    inst_empresarial_mes1: '', inst_empresarial_mes2: '', inst_empresarial_mes3: '', inst_empresarial_mes4: '', inst_empresarial_mes5: '',
    inst_fullpopular_nombre: '', inst_fullpopular_correo: '', inst_fullpopular_celular: '',
    inst_fullpopular_mes1: '', inst_fullpopular_mes2: '',
  };

  const tabsConfig = [
    { key: 'programa',  label: 'Programa',  icon: 'fa-book' },
    { key: 'oferta',    label: 'Oferta',    icon: 'fa-tag' },
    ...(tipoOferta === 'CERRADA' ? [{ key: 'empresa', label: 'Empresa', icon: 'fa-building' }] : []),
    { key: 'ubicacion', label: 'Ubicación', icon: 'fa-map-marker-alt' },
    { key: 'horario',   label: 'Horario',   icon: 'fa-clock' },
  ];

  useEffect(() => {
    if (!duracion) { setProgramas([]); return; }
    if (!busquedaPrograma || busquedaPrograma.length < 2) { setProgramas([]); return; }
    setCargandoProgs(true);
    axios.get(`${API}/programas/buscar?duracion=${duracion}&texto=${busquedaPrograma}`)
      .then(r => setProgramas(r.data)).catch(console.error).finally(() => setCargandoProgs(false));
  }, [duracion, busquedaPrograma]);

  useEffect(() => {
    axios.get(`${API}/catalogos/programas-especiales`).then(r => setProgramasEspeciales(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const url = `${API}/empresas?tipo=${modalidadOferta}${busquedaEmpresa ? `&q=${busquedaEmpresa}` : ''}`;
    axios.get(url).then(r => setEmpresasExistentes(r.data)).catch(console.error);
  }, [busquedaEmpresa, modalidadOferta]);

  useEffect(() => {
    axios.get(`${API}/catalogos/tipos-empresa?modalidad=${modalidadOferta}`)
      .then(r => setTiposEmpresa(r.data)).catch(console.error);
  }, [modalidadOferta]);

  useEffect(() => {
    axios.get(`${API}/ubicacion/departamentos`).then(r => setDepartamentos(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!departamento) { setMunicipios([]); setMunicipio(''); return; }
    axios.get(`${API}/ubicacion/municipios?departamento=${departamento}`)
      .then(r => { setMunicipios(r.data); if (r.data.length > 0) setMunicipio(r.data[0]._id); }).catch(console.error);
  }, [departamento]);

  useEffect(() => {
    if (!municipio) { setCorregimientos([]); setCorregimiento(''); return; }
    axios.get(`${API}/ubicacion/corregimientos?municipio=${municipio}`)
      .then(r => { setCorregimientos(r.data); if (r.data.length > 0) setCorregimiento(r.data[0]._id); }).catch(console.error);
  }, [municipio]);

  useEffect(() => {
    axios.get(`${API}/programas/sectores`).then(r => setSectores(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`${API}/catalogos/modalidades-oferta`).then(r => setModalidades(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`${API}/programas/duraciones`).then(r => setDuracionesDisponibles(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`${API}/catalogos/tipos-oferta`).then(r => setTiposOferta(r.data)).catch(console.error);
  }, []);

  const tabIndex = tabsConfig.findIndex(t => t.key === tabActiva);
  const irTab = (dir) => {
    const idx = tabIndex + dir;
    if (idx >= 0 && idx < tabsConfig.length) setTabActiva(tabsConfig[idx].key);
  };

  const toggleFecha = (fechaStr) => {
    setHorarios(prev => {
      const nuevo = { ...prev };
      if (nuevo[fechaStr]) delete nuevo[fechaStr];
      else nuevo[fechaStr] = { hora_inicio: '07:00', hora_fin: '09:00' };
      return nuevo;
    });
  };

  const actualizarHorario = (fechaStr, campo, valor) => {
    setHorarios(prev => ({
      ...prev,
      [fechaStr]: { ...prev[fechaStr], [campo]: valor }
    }));
  };

  const mostrarNotificacion = (msg, tipo = 'success') => {
    setNotificacion({ msg, tipo });
    setTimeout(() => setNotificacion(null), 4000);
  };

  const handleSubmit = async () => {
    const errs = {};
    if (!programaSeleccionado)   errs.programa         = 'Selecciona un programa';
    if (!sectorSeleccionado)     errs.sector           = 'Selecciona un sector';
    if (!fechaInicio)            errs.fechaInicio      = 'Requerida';
    if (!fechaInscripcion)       errs.fechaInscripcion = 'Requerida';
    if (!departamento)           errs.departamento     = 'Selecciona departamento';
    if (!municipio)              errs.municipio        = 'Selecciona municipio';
    if (!direccion)              errs.direccion        = 'Ingresa una dirección';

    if (Object.keys(errs).length) {
      setErrores(errs);
      if (errs.programa || errs.sector) setTabActiva('programa');
      else if (errs.fechaInicio || errs.fechaInscripcion) setTabActiva('oferta');
      else if (errs.departamento || errs.municipio || errs.direccion) setTabActiva('ubicacion');
      return;
    }

    setEnviando(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const lugarRes = await axios.post(`${API}/ubicacion/lugares`, {
        departamento, municipio, corregimiento, ambiente, direccion
      }, config);

      await axios.post(`${API}/ofertas`, {
        programa: programaSeleccionado,
        sector: sectorSeleccionado,
        modalidad_oferta: modalidadOferta,
        tipo_oferta: tipoOferta,
        cupo,
        fecha_inicio: fechaInicio,
        fecha_terminacion: fechaTerminacion || undefined,
        fecha_inscripcion: fechaInscripcion,
        codigo_ficha: codigoFicha || undefined,
        codigo_solicitud: codigoSolicitud || undefined,
        empresa_solicitante: empresaSeleccionada || undefined,
        programa_especial: programaEspecial || undefined,
        lugar: lugarRes.data._id,
        horarios: Object.entries(horarios).map(([fecha, h]) => ({
          fecha, hora_inicio: h.hora_inicio, hora_fin: h.hora_fin,
        })),
        info_empresa_regular: (tipoOferta === 'CERRADA' && modalidadOferta === 'REGULAR' && !empresaSeleccionada)
          ? infoEmpresa : undefined,
        info_empresa_campesena: (tipoOferta === 'CERRADA' && modalidadOferta === 'CAMPESENA' && !empresaSeleccionada)
          ? infoCampesena : undefined,
      }, config);

      mostrarNotificacion('¡Oferta creada correctamente!');
      resetForm();
    } catch (err) {
      console.error(err);
      mostrarNotificacion('Error al guardar: ' + (err.response?.data?.msg || err.message), 'error');
    } finally {
      setEnviando(false);
    }
  };

  const resetForm = () => {
    setTabActiva('programa');
    setDuracion(''); setProgramaSeleccionado(''); setBusquedaPrograma(''); setProgramaInfo(null);
    setModalidadOferta('REGULAR'); setTipoOferta('ABIERTA');
    setCupo(25); setFechaInicio(''); setFechaTerminacion(''); setFechaInscripcion('');
    setCodigoFicha(''); setCodigoSolicitud(''); setProgramaEspecial('');
    setEmpresaSeleccionada(''); setBusquedaEmpresa('');
    setDepartamento(''); setMunicipio(''); setAmbiente(''); setDireccion('');
    setHorarios({}); setErrores({});
    setSectorSeleccionado('');
    setInfoEmpresa(infoEmpresaVacia);
    setInfoCampesena(infoCampesenaVacia);
  };

  return (
    <div className="dashboard-content">

      {/* ── NOTIFICACIÓN FLOTANTE ── */}
      {notificacion && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: notificacion.tipo === 'success'
            ? 'linear-gradient(135deg, #1a3a5c, #2d6a9f)'
            : 'linear-gradient(135deg, #c0392b, #e74c3c)',
          color: '#fff', borderRadius: '12px', padding: '16px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: '12px',
          minWidth: '300px', animation: 'slideInNotif 0.35s ease',
        }}>
          <i className={`fas ${notificacion.tipo === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`}
            style={{ fontSize: '22px', color: '#f0c040' }}></i>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>{notificacion.msg}</span>
          <button onClick={() => setNotificacion(null)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: '#fff', fontSize: '13px' }}>
            ✕
          </button>
        </div>
      )}

      <div className="oferta-page">
        <div className="oferta__card">

          {/* ── STEPPER ── */}
          <div className="oferta__header">
            <div className="oferta__stepper">
              {tabsConfig.map((t, i) => {
                const isCompleted = i < tabIndex;
                const isActive    = i === tabIndex;
                return (
                  <React.Fragment key={t.key}>
                    <div
                      className={`stepper__step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      onClick={() => setTabActiva(t.key)}
                    >
                      <div className="stepper__circle">
                        {isCompleted ? <i className="fas fa-check"></i> : <span>{i + 1}</span>}
                      </div>
                      <span className="stepper__label">{t.label}</span>
                    </div>
                    {i < tabsConfig.length - 1 && (
                      <div className={`stepper__line ${isCompleted ? 'completed' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="oferta__content">

            {/* ══ PROGRAMA ══ */}
            {tabActiva === 'programa' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-book"></i> Información del Programa
                </h2>
                <div className="form-section__grid">

                  <div className="form-group">
                    <label className="required">Duración del programa</label>
                    <select className="form__select" value={duracion}
                      onChange={e => { setDuracion(e.target.value); setProgramaSeleccionado(''); setBusquedaPrograma(''); setProgramas([]); }}>
                      <option value="">Selecciona duración</option>
                      {duracionesDisponibles.map(d => (
                        <option key={d} value={d}>{d} horas</option>
                      ))}
                    </select>
                  </div>

                  {duracion && (
                    <div className="form-group form-group--full">
                      <label className="required">Programa</label>
                      <input type="text"
                        className={`form__input ${errores.programa ? 'error' : ''}`}
                        placeholder="Escribe para buscar programa..."
                        value={busquedaPrograma}
                        onChange={e => { setBusquedaPrograma(e.target.value); setProgramaSeleccionado(''); }}
                      />
                      {cargandoProgs && <span className="field-hint">Buscando...</span>}
                      {programas.length > 0 && !programaSeleccionado && (
                        <div className="programa__lista">
                          {programas.map(p => (
                            <div key={p._id} className="programa__item"
                              onClick={() => {
                                setProgramaSeleccionado(p._id);
                                setProgramaInfo(p);
                                setBusquedaPrograma(p.nombre);
                                setProgramas([]);
                              }}>
                              {p.nombre}
                            </div>
                          ))}
                        </div>
                      )}
                      {errores.programa && <span className="field-error">{errores.programa}</span>}
                    </div>
                  )}

                  {programaInfo && (
                    <div className="form-section__grid" style={{ marginTop: '16px' }}>
                      <div className="form-group">
                        <label>Código - Versión</label>
                        <input type="text" className="form__input" value={`${programaInfo.codigo} - ${programaInfo.version}`} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Estado</label>
                        <input type="text" className="form__input" value={programaInfo.estado} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Duración</label>
                        <input type="text" className="form__input" value={programaInfo.duracion} readOnly />
                      </div>
                    </div>
                  )}

                  <div className="form-group form-group--full">
                    <label className="required">
                      Sector del Centro al cual pertenece el Programa de Formación
                    </label>
                    <select className={`form__select ${errores.sector ? 'error' : ''}`}
                      value={sectorSeleccionado}
                      onChange={e => setSectorSeleccionado(e.target.value)}>
                      <option value="">Selecciona un sector</option>
                      {sectores.map(s => (
                        <option key={s._id} value={s._id}>{s.codigo} — {s.nombre}</option>
                      ))}
                    </select>
                    {errores.sector && <span className="field-error">{errores.sector}</span>}
                  </div>

                </div>
              </div>
            )}

            {/* ══ OFERTA ══ */}
            {tabActiva === 'oferta' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-tag"></i> Detalles de la Oferta
                </h2>
                <div className="form-section__grid">

                  <div className="form-group">
                    <label className="required">Modalidad de oferta</label>
                    <select className="form__select" value={modalidadOferta}
                      onChange={e => setModalidadOferta(e.target.value)}>
                      {modalidades.map(m => (
                        <option key={m._id} value={m.nombre}>{m.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="required">Tipo de oferta</label>
                    <select className="form__select" value={tipoOferta}
                      onChange={e => {
                        const val = e.target.value;
                        setTipoOferta(val);
                        if (val !== 'CERRADA') {
                          setEmpresaSeleccionada('');
                          setBusquedaEmpresa('');
                          setInfoEmpresa(infoEmpresaVacia);
                          if (tabActiva === 'empresa') setTabActiva('oferta');
                        }
                      }}>
                      {tiposOferta.map(t => (
                        <option key={t._id} value={t.nombre}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="required">Cupo</label>
                    <input type="number" className="form__input" value={cupo} min={1}
                      onChange={e => setCupo(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="required">Fecha de inicio</label>
                    <input type="date" className={`form__input ${errores.fechaInicio ? 'error' : ''}`}
                      value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                    {errores.fechaInicio && <span className="field-error">{errores.fechaInicio}</span>}
                  </div>

                  <div className="form-group">
                    <label>Fecha de terminación</label>
                    <input type="date" className="form__input" value={fechaTerminacion}
                      onChange={e => setFechaTerminacion(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="required">Fecha de inscripción</label>
                    <input type="date" className={`form__input ${errores.fechaInscripcion ? 'error' : ''}`}
                      value={fechaInscripcion} onChange={e => setFechaInscripcion(e.target.value)} />
                    {errores.fechaInscripcion && <span className="field-error">{errores.fechaInscripcion}</span>}
                  </div>

                  <div className="form-group">
                    <label>Programa especial</label>
                    <select className="form__select" value={programaEspecial}
                      onChange={e => setProgramaEspecial(e.target.value)}>
                      <option value="">Ninguno</option>
                      {programasEspeciales.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
                    </select>
                  </div>

                  {/* ── INSTRUCTOR TÉCNICO ── */}
                  <div className="form-group form-group--full">
                    <hr style={{ border: 'none', borderTop: '2px solid #e8f0fe', margin: '8px 0 16px 0' }} />
                    <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-chalkboard-teacher" style={{ color: '#f0c040', fontSize: '18px' }}></i>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Instructor Técnico</span>
                    </div>
                  </div>
                  <div className="form-group form-group--full">
                    <label>Nombre completo</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="text" className="form__input" value={infoCampesena.inst_tecnico_nombre} onChange={e => updateCampesena('inst_tecnico_nombre', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="email" className="form__input" value={infoCampesena.inst_tecnico_correo} onChange={e => updateCampesena('inst_tecnico_correo', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Celular</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-mobile-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="tel" className="form__input" value={infoCampesena.inst_tecnico_celular} onChange={e => updateCampesena('inst_tecnico_celular', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  {['mes1','mes2','mes3','mes4','mes5'].map((mes, i) => (
                    <div className="form-group" key={mes}>
                      <label>Fechas ejecución Mes {i + 1}</label>
                      <input type="text" className="form__input" placeholder="Ej: 01/03/2026 - 15/03/2026"
                        value={infoCampesena[`inst_tecnico_${mes}`]}
                        onChange={e => updateCampesena(`inst_tecnico_${mes}`, e.target.value)} />
                    </div>
                  ))}

                  {/* ── INSTRUCTOR EMPRESARIAL ── */}
                  <div className="form-group form-group--full">
                    <hr style={{ border: 'none', borderTop: '2px solid #e8f0fe', margin: '8px 0 16px 0' }} />
                    <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-briefcase" style={{ color: '#f0c040', fontSize: '18px' }}></i>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Instructor Empresarial</span>
                    </div>
                  </div>
                  <div className="form-group form-group--full">
                    <label>Nombre completo</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="text" className="form__input" value={infoCampesena.inst_empresarial_nombre} onChange={e => updateCampesena('inst_empresarial_nombre', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="email" className="form__input" value={infoCampesena.inst_empresarial_correo} onChange={e => updateCampesena('inst_empresarial_correo', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Celular</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-mobile-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="tel" className="form__input" value={infoCampesena.inst_empresarial_celular} onChange={e => updateCampesena('inst_empresarial_celular', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  {['mes1','mes2','mes3','mes4','mes5'].map((mes, i) => (
                    <div className="form-group" key={mes}>
                      <label>Fechas ejecución Mes {i + 1}</label>
                      <input type="text" className="form__input" placeholder="Ej: 01/03/2026 - 15/03/2026"
                        value={infoCampesena[`inst_empresarial_${mes}`]}
                        onChange={e => updateCampesena(`inst_empresarial_${mes}`, e.target.value)} />
                    </div>
                  ))}

                  {/* ── INSTRUCTOR FULL POPULAR ── */}
                  <div className="form-group form-group--full">
                    <hr style={{ border: 'none', borderTop: '2px solid #e8f0fe', margin: '8px 0 16px 0' }} />
                    <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fas fa-star" style={{ color: '#f0c040', fontSize: '18px' }}></i>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Instructor Full Popular</span>
                    </div>
                  </div>
                  <div className="form-group form-group--full">
                    <label>Nombre completo</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="text" className="form__input" value={infoCampesena.inst_fullpopular_nombre} onChange={e => updateCampesena('inst_fullpopular_nombre', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-envelope" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="email" className="form__input" value={infoCampesena.inst_fullpopular_correo} onChange={e => updateCampesena('inst_fullpopular_correo', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Celular</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-mobile-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                      <input type="tel" className="form__input" value={infoCampesena.inst_fullpopular_celular} onChange={e => updateCampesena('inst_fullpopular_celular', e.target.value)} style={{ paddingLeft: '38px' }} />
                    </div>
                  </div>
                  {['mes1','mes2'].map((mes, i) => (
                    <div className="form-group" key={mes}>
                      <label>Fechas ejecución Mes {i + 1}</label>
                      <input type="text" className="form__input" placeholder="Ej: 01/03/2026 - 15/03/2026"
                        value={infoCampesena[`inst_fullpopular_${mes}`]}
                        onChange={e => updateCampesena(`inst_fullpopular_${mes}`, e.target.value)} />
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* ══ EMPRESA ══ */}
            {tabActiva === 'empresa' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-building"></i> Empresa Solicitante
                </h2>
                <div className="form-section__grid">

                  <div className="form-group form-group--full">
                    <label>Tipo de empresa</label>
                    <select className="form__select" value={infoEmpresa.tipo_empresa}
                      onChange={e => updateEmpresa('tipo_empresa', e.target.value)}>
                      <option value="">Selecciona...</option>
                      {tiposEmpresa.map(t => (
                        <option key={t._id} value={t._id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {modalidadOferta === 'REGULAR' && !empresaSeleccionada && (
                    <>
                      <div className="form-group form-group--full">
                        <hr style={{ border: 'none', borderTop: '2px solid #e8f0fe', margin: '8px 0 16px 0' }} />
                        <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i className="fas fa-briefcase" style={{ color: '#f0c040', fontSize: '18px' }}></i>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Información de la Empresa</span>
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>¿La solicitud hace parte de algún convenio?</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-handshake" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" placeholder="Ej: Convenio SENA - Alcaldía 2024"
                            value={infoEmpresa.cual_convenio} onChange={e => updateEmpresa('cual_convenio', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-building" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" value={infoEmpresa.nombre_empresa} onChange={e => updateEmpresa('nombre_empresa', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>NIT de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-id-card" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" placeholder="Ej: 900123456-1" value={infoEmpresa.nit_empresa} onChange={e => updateEmpresa('nit_empresa', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Fecha de creación</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-calendar-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="date" className="form__input" value={infoEmpresa.fecha_creacion} onChange={e => updateEmpresa('fecha_creacion', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>Dirección de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-map-marker-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" placeholder="Calle, carrera, barrio..." value={infoEmpresa.direccion_empresa} onChange={e => updateEmpresa('direccion_empresa', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>Nombre del representante legal</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-user-tie" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" value={infoEmpresa.nombre_representante_legal} onChange={e => updateEmpresa('nombre_representante_legal', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>Nombre completo del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" value={infoEmpresa.nombre_contacto} onChange={e => updateEmpresa('nombre_contacto', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>No. de celular del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-mobile-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="tel" className="form__input" placeholder="Ej: 3001234567" value={infoEmpresa.celular_contacto} onChange={e => updateEmpresa('celular_contacto', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Correo electrónico del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-envelope" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="email" className="form__input" placeholder="contacto@empresa.com" value={infoEmpresa.correo_contacto} onChange={e => updateEmpresa('correo_contacto', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Número de empleados</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-users" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="number" className="form__input" min={1} value={infoEmpresa.numero_empleados} onChange={e => updateEmpresa('numero_empleados', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                    </>
                  )}

                  {modalidadOferta === 'CAMPESENA' && !empresaSeleccionada && (
                    <>
                      <div className="form-group form-group--full">
                        <hr style={{ border: 'none', borderTop: '2px solid #e8f0fe', margin: '8px 0 16px 0' }} />
                        <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)', borderRadius: '10px', padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i className="fas fa-tractor" style={{ color: '#f0c040', fontSize: '18px' }}></i>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Información de la Empresa</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-building" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" value={infoCampesena.nombre_empresa} onChange={e => updateCampesena('nombre_empresa', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>NIT de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-id-card" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" placeholder="Ej: 900123456-1" value={infoCampesena.nit_empresa} onChange={e => updateCampesena('nit_empresa', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Fecha de creación</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-calendar-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="date" className="form__input" value={infoCampesena.fecha_creacion} onChange={e => updateCampesena('fecha_creacion', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>Dirección de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-map-marker-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" placeholder="Calle, carrera, barrio..." value={infoCampesena.direccion_empresa} onChange={e => updateCampesena('direccion_empresa', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>Nombre del representante legal</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-user-tie" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" value={infoCampesena.nombre_representante_legal} onChange={e => updateCampesena('nombre_representante_legal', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label>Nombre completo del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-user" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="text" className="form__input" value={infoCampesena.nombre_contacto} onChange={e => updateCampesena('nombre_contacto', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>No. de celular del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-mobile-alt" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="tel" className="form__input" placeholder="Ej: 3001234567" value={infoCampesena.celular_contacto} onChange={e => updateCampesena('celular_contacto', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Correo electrónico del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-envelope" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="email" className="form__input" placeholder="contacto@empresa.com" value={infoCampesena.correo_contacto} onChange={e => updateCampesena('correo_contacto', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Número de empleados</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-users" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#2d6a9f' }}></i>
                          <input type="number" className="form__input" min={1} value={infoCampesena.numero_empleados} onChange={e => updateCampesena('numero_empleados', e.target.value)} style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            )}

            {/* ══ UBICACIÓN ══ */}
            {tabActiva === 'ubicacion' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-map-marker-alt"></i> Ubicación
                </h2>
                <div className="form-section__grid">
                  <div className="form-group">
                    <label className="required">Departamento</label>
                    <select className={`form__select ${errores.departamento ? 'error' : ''}`} value={departamento}
                      onChange={e => { setDepartamento(e.target.value); setMunicipio(''); }}>
                      <option value="">Selecciona departamento</option>
                      {departamentos.map(d => <option key={d._id} value={d._id}>{d.nombre}</option>)}
                    </select>
                    {errores.departamento && <span className="field-error">{errores.departamento}</span>}
                  </div>
                  <div className="form-group">
                    <label className="required">Municipio</label>
                    <select className={`form__select ${errores.municipio ? 'error' : ''}`} value={municipio}
                      onChange={e => setMunicipio(e.target.value)} disabled={!departamento}>
                      <option value="">Selecciona municipio</option>
                      {municipios.map(m => <option key={m._id} value={m._id}>{m.nombre}</option>)}
                    </select>
                    {errores.municipio && <span className="field-error">{errores.municipio}</span>}
                  </div>
                  <div className="form-group">
                    <label>Corregimiento</label>
                    <select className="form__select" value={corregimiento}
                      onChange={e => setCorregimiento(e.target.value)} disabled={!municipio}>
                      <option value="">Selecciona corregimiento</option>
                      {corregimientos.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ambiente / Instalación</label>
                    <input type="text" className="form__input" placeholder="Ej: Aula 201, Taller mecánico..."
                      value={ambiente} onChange={e => setAmbiente(e.target.value)} />
                  </div>
                  <div className="form-group form-group--full">
                    <label className="required">Dirección</label>
                    <input type="text" className={`form__input ${errores.direccion ? 'error' : ''}`}
                      placeholder="Calle, carrera, barrio..." value={direccion} onChange={e => setDireccion(e.target.value)} />
                    {errores.direccion && <span className="field-error">{errores.direccion}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ══ HORARIO — CALENDARIO ══ */}
            {tabActiva === 'horario' && (() => {
              const { mes, anio } = mesCalendario;
              const diasEnMes  = new Date(anio, mes + 1, 0).getDate();
              const primerDia  = new Date(anio, mes, 1).getDay();
              const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
              const fechasSeleccionadas = Object.keys(horarios).sort();
              const totalHoras = Object.values(horarios).reduce((total, h) => {
                const [hi, mi] = h.hora_inicio.split(':').map(Number);
                const [hf, mf] = h.hora_fin.split(':').map(Number);
                const diff = (hf * 60 + mf) - (hi * 60 + mi);
                return total + (diff > 0 ? diff / 60 : 0);
              }, 0);

              return (
                <div className="form-section active">
                  <h2 className="form-section__title"><i className="fas fa-clock"></i> Horario</h2>

                  {/* Resumen */}
                  <div style={{ border: '1.5px solid #d0e4f7', borderRadius: '12px', padding: '20px 24px', marginBottom: '28px', background: '#f7fbff' }}>
                    <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '16px', fontSize: '15px' }}>Resumen del Horario</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Duración del programa:', valor: duracion ? `${duracion} horas` : '—' },
                        { label: 'Fecha de inicio:', valor: fechaInicio ? new Date(fechaInicio + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—' },
                        { label: 'Total horas programadas:', valor: `${totalHoras.toFixed(2)} horas` },
                        { label: 'Días seleccionados:', valor: fechasSeleccionadas.length || '—' },
                      ].map(({ label, valor }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #e2edf7', borderRadius: '8px', padding: '12px 16px', gap: '10px' }}>
                          <span style={{ color: '#555', fontSize: '13px' }}>{label}</span>
                          <span style={{ background: '#e8f0fe', color: '#1a3a5c', fontWeight: 700, borderRadius: '20px', padding: '3px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}>{valor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calendario */}
                  <div style={{ background: '#fff', border: '1.5px solid #d0e4f7', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
                    {/* Navegación mes */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <button type="button" onClick={() => setMesCalendario(prev => {
                        let m = prev.mes - 1, a = prev.anio;
                        if (m < 0) { m = 11; a--; }
                        return { mes: m, anio: a };
                      })} style={{ background: 'none', border: '1.5px solid #d0e4f7', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', color: '#1a3a5c', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                      <span style={{ fontWeight: 700, color: '#1a3a5c', fontSize: '17px' }}>{MESES[mes]} {anio}</span>
                      <button type="button" onClick={() => setMesCalendario(prev => {
                        let m = prev.mes + 1, a = prev.anio;
                        if (m > 11) { m = 0; a++; }
                        return { mes: m, anio: a };
                      })} style={{ background: 'none', border: '1.5px solid #d0e4f7', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', color: '#1a3a5c', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                    </div>

                    {/* Encabezado días semana */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                      {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#888', padding: '4px 0' }}>{d}</div>
                      ))}
                    </div>

                    {/* Celdas del mes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {Array.from({ length: primerDia }).map((_, i) => <div key={`e-${i}`} />)}
                      {Array.from({ length: diasEnMes }).map((_, i) => {
                        const dia = i + 1;
                        const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                        const seleccionado = !!horarios[fechaStr];
                        return (
                          <div key={dia} onClick={() => toggleFecha(fechaStr)}
                            style={{
                              textAlign: 'center', padding: '9px 4px', borderRadius: '8px', cursor: 'pointer',
                              fontWeight: seleccionado ? 700 : 400, fontSize: '14px',
                              background: seleccionado ? 'linear-gradient(135deg, #1a3a5c, #2d6a9f)' : '#f4f8fd',
                              color: seleccionado ? '#fff' : '#1a3a5c',
                              border: seleccionado ? '2px solid #2d6a9f' : '1.5px solid #e2edf7',
                              transition: 'all 0.15s', userSelect: 'none',
                            }}>
                            {dia}
                            {seleccionado && (
                              <div style={{ width: '5px', height: '5px', background: '#f0c040', borderRadius: '50%', margin: '2px auto 0' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lista fechas seleccionadas con horario */}
                  {fechasSeleccionadas.length > 0 ? (
                    <div>
                      <div style={{ fontWeight: 600, color: '#1a3a5c', marginBottom: '14px', fontSize: '14px' }}>
                        <i className="fas fa-list-ul" style={{ marginRight: '8px', color: '#2d6a9f' }}></i>
                        Fechas seleccionadas ({fechasSeleccionadas.length})
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {fechasSeleccionadas.map(fechaStr => {
                          const [a, m2, d] = fechaStr.split('-');
                          const nombreDia = new Date(fechaStr + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long' });
                          const h = horarios[fechaStr];
                          return (
                            <div key={fechaStr} style={{ background: '#fff', border: '2px solid #2d6a9f', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(45,106,159,0.1)' }}>
                              <div style={{ background: 'linear-gradient(135deg, #1a3a5c, #2d6a9f)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>
                                  {nombreDia} {d}/{m2}/{a}
                                </span>
                                <button type="button" onClick={() => toggleFecha(fechaStr)}
                                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  ✕
                                </button>
                              </div>
                              <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora inicio</label>
                                  <input type="time" className="form__input" value={h.hora_inicio}
                                    onChange={e => actualizarHorario(fechaStr, 'hora_inicio', e.target.value)}
                                    style={{ fontSize: '13px', padding: '6px 8px' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora fin</label>
                                  <input type="time" className="form__input" value={h.hora_fin}
                                    onChange={e => actualizarHorario(fechaStr, 'hora_fin', e.target.value)}
                                    style={{ fontSize: '13px', padding: '6px 8px' }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="field-hint" style={{ textAlign: 'center', padding: '24px 0', fontSize: '14px' }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#2d6a9f', fontSize: '18px' }}></i>
                      Haz clic en los días del calendario para agregar fechas al horario
                    </p>
                  )}

                </div>
              );
            })()}

          </div>

          {/* Footer */}
          <div className="oferta__footer">
            <button className="btn btn--secondary" onClick={() => irTab(-1)} disabled={tabIndex === 0}>
              <i className="fas fa-arrow-left"></i> Anterior
            </button>
            {tabIndex < tabsConfig.length - 1 ? (
              <button className="btn btn--primary" onClick={() => irTab(1)}>
                Siguiente <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button className="btn btn--success" onClick={handleSubmit} disabled={enviando}>
                {enviando
                  ? <><i className="fas fa-spinner fa-spin"></i> Guardando...</>
                  : <><i className="fas fa-save"></i> Guardar oferta</>
                }
              </button>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideInNotif {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CrearOferta;