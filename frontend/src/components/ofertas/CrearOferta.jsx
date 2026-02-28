import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CrearOferta.css';

const API = 'http://localhost:4000/api';

const DURACIONES = [40, 60, 80, 120, 160, 200, 240, 300, 360, 400, 480, 600, 800, 880,   1200, 1600, 1760, 2640, 3520];
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const CrearOferta = () => {
  const [tabActiva, setTabActiva] = useState('programa');
  const [enviando, setEnviando]   = useState(false);
  const [exito, setExito]         = useState(false);
  const [errores, setErrores]     = useState({});

  const [duracion, setDuracion]                         = useState('');
  const [programas, setProgramas]                       = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [busquedaPrograma, setBusquedaPrograma]         = useState('');
  const [cargandoProgs, setCargandoProgs]               = useState(false);

  const [modalidadOferta, setModalidadOferta] = useState('REGULAR');
  const [tipoOferta, setTipoOferta]           = useState('ABIERTA');
  const [cupo, setCupo]                       = useState(25);
  const [fechaInicio, setFechaInicio]         = useState('');
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [fechaInscripcion, setFechaInscripcion] = useState('');
  const [codigoFicha, setCodigoFicha]         = useState('');
  const [codigoSolicitud, setCodigoSolicitud] = useState('');
  const [programasEspeciales, setProgramasEspeciales] = useState([]);
  const [programaEspecial, setProgramaEspecial] = useState('');
  const [programaInfo, setProgramaInfo]       = useState(null);

  // ── Buscador empresas ya registradas en empresas_oferta ──
  const [empresasExistentes, setEmpresasExistentes] = useState([]);
  const [busquedaEmpresa, setBusquedaEmpresa]       = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');

  // ── Catálogo tipos de empresa (LIMITADA, COOPERATIVA...) desde /empresas ──
  const [tiposEmpresa, setTiposEmpresa] = useState([]);

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

  const [horarios, setHorarios] = useState([]);

  const [infoEmpresa, setInfoEmpresa] = useState({
    cual_convenio: '',
    nombre_empresa: '',
    nit_empresa: '',
    fecha_creacion: '',
    tipo_empresa: '',
    direccion_empresa: '',
    nombre_representante_legal: '',
    nombre_contacto: '',
    celular_contacto: '',
    correo_contacto: '',
    numero_empleados: '',
  });

  const updateEmpresa = (campo, valor) =>
    setInfoEmpresa(prev => ({ ...prev, [campo]: valor }));

  const infoEmpresaVacia = {
    cual_convenio: '', nombre_empresa: '', nit_empresa: '',
    fecha_creacion: '', tipo_empresa: '', direccion_empresa: '',
    nombre_representante_legal: '', nombre_contacto: '',
    celular_contacto: '', correo_contacto: '', numero_empleados: '',
  };

  // ✅ tabsConfig dinámico — paso Empresa solo si tipoOferta === 'CERRADA'
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
      .then(r => setProgramas(r.data))
      .catch(console.error)
      .finally(() => setCargandoProgs(false));
  }, [duracion, busquedaPrograma]);

  useEffect(() => {
    axios.get(`${API}/catalogos/programas-especiales`).then(r => setProgramasEspeciales(r.data)).catch(console.error);
  }, []);

  // Buscar empresas ya registradas en empresas_oferta
  useEffect(() => {
    axios.get(`${API}/empresas_oferta${busquedaEmpresa ? `?q=${busquedaEmpresa}` : ''}`)
      .then(r => setEmpresasExistentes(r.data))
      .catch(console.error);
  }, [busquedaEmpresa]);

  // Catálogo tipos de empresa desde /empresas (LIMITADA, COOPERATIVA, etc.)
  useEffect(() => {
    axios.get(`${API}/empresas`)
      .then(r => setTiposEmpresa(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`${API}/ubicacion/departamentos`).then(r => setDepartamentos(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!departamento) { setMunicipios([]); setMunicipio(''); return; }
    axios.get(`${API}/ubicacion/municipios?departamento=${departamento}`)
      .then(r => { setMunicipios(r.data); if (r.data.length > 0) setMunicipio(r.data[0]._id); })
      .catch(console.error);
  }, [departamento]);

  useEffect(() => {
    if (!municipio) { setCorregimientos([]); setCorregimiento(''); return; }
    axios.get(`${API}/ubicacion/corregimientos?municipio=${municipio}`)
      .then(r => { setCorregimientos(r.data); if (r.data.length > 0) setCorregimiento(r.data[0]._id); })
      .catch(console.error);
  }, [municipio]);

  useEffect(() => {
    axios.get(`${API}/programas/sectores`).then(r => setSectores(r.data)).catch(console.error);
  }, []);

  const tabIndex = tabsConfig.findIndex(t => t.key === tabActiva);
  const irTab = (dir) => {
    const idx = tabIndex + dir;
    if (idx >= 0 && idx < tabsConfig.length) setTabActiva(tabsConfig[idx].key);
  };

  const toggleDia = (dia) => {
    const existe = horarios.find(h => h.dia === dia);
    if (existe) setHorarios(horarios.filter(h => h.dia !== dia));
    else setHorarios([...horarios, { dia, hora_inicio: '07:00', hora_fin: '09:00' }]);
  };

  const actualizarHorario = (dia, campo, valor) => {
    setHorarios(horarios.map(h => h.dia === dia ? { ...h, [campo]: valor } : h));
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
      const lugarRes = await axios.post(`${API}/ubicacion/lugares`, {
        departamento, municipio, corregimiento, ambiente, direccion
      });

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
        // Solo guarda info_empresa si: cerrada + regular + no seleccionó empresa existente
        info_empresa_regular: (tipoOferta === 'CERRADA' && modalidadOferta === 'REGULAR' && !empresaSeleccionada)
          ? infoEmpresa
          : undefined,
      });

      setExito(true);
    } catch (err) {
      console.error(err);
      alert('Error al guardar: ' + (err.response?.data?.msg || err.message));
    } finally {
      setEnviando(false);
    }
  };

  const resetForm = () => {
    setExito(false); setTabActiva('programa');
    setDuracion(''); setProgramaSeleccionado(''); setBusquedaPrograma('');
    setModalidadOferta('REGULAR'); setTipoOferta('ABIERTA');
    setCupo(25); setFechaInicio(''); setFechaTerminacion(''); setFechaInscripcion('');
    setCodigoFicha(''); setCodigoSolicitud(''); setProgramaEspecial('');
    setEmpresaSeleccionada(''); setBusquedaEmpresa('');
    setDepartamento(''); setMunicipio(''); setAmbiente(''); setDireccion('');
    setHorarios([]); setErrores({});
    setSectorSeleccionado('');
    setInfoEmpresa(infoEmpresaVacia);
  };

  if (exito) return (
    <div className="dashboard-content">
      <div className="oferta-page">
        <div className="oferta__card oferta__exito">
          <i className="fas fa-check-circle"></i>
          <h2>¡Oferta creada correctamente!</h2>
          <button className="btn btn--primary" onClick={resetForm}>Crear otra oferta</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
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
                      {DURACIONES.map(d => <option key={d} value={d}>{d} horas</option>)}
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
                      <option value="REGULAR">Regular</option>
                      <option value="CAMPESENA">Campesena</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="required">Tipo de oferta</label>
                    <select className="form__select" value={tipoOferta}
                      onChange={e => {
                        const val = e.target.value;
                        setTipoOferta(val);
                        // Si cambia a ABIERTA: limpiar empresa y salir del tab empresa
                        if (val === 'ABIERTA') {
                          setEmpresaSeleccionada('');
                          setBusquedaEmpresa('');
                          setInfoEmpresa(infoEmpresaVacia);
                          if (tabActiva === 'empresa') setTabActiva('oferta');
                        }
                      }}>
                      <option value="ABIERTA">Abierta</option>
                      <option value="CERRADA">Cerrada</option>
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

                </div>
              </div>
            )}

            {/* ══ EMPRESA — solo aparece si tipoOferta === 'CERRADA' ══ */}
            {tabActiva === 'empresa' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-building"></i> Empresa Solicitante
                </h2>
                <div className="form-section__grid">

                  {/* Buscar empresa ya registrada en empresas_oferta */}
                  <div className="form-group form-group--full">
                    <label>Buscar empresa ya registrada</label>
                    <input type="text" className="form__input"
                      placeholder="Escribe el nombre..."
                      value={busquedaEmpresa}
                      onChange={e => setBusquedaEmpresa(e.target.value)} />
                  </div>

                  <div className="form-group form-group--full">
                    <label>
                      Seleccionar empresa existente
                      <span className="field-hint" style={{ marginLeft: 8 }}>
                        (Si no seleccionas ninguna, llena el formulario abajo)
                      </span>
                    </label>
                    <select className="form__select" value={empresaSeleccionada}
                      onChange={e => setEmpresaSeleccionada(e.target.value)}>
                      <option value="">— Nueva empresa —</option>
                      {empresasExistentes.map(e => (
                        <option key={e._id} value={e._id}>
                          {e.nombre} {e.nit ? `— NIT: ${e.nit}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Formulario nueva empresa: solo si REGULAR y no seleccionó empresa existente */}
                  {modalidadOferta === 'REGULAR' && !empresaSeleccionada && (
                    <>
                      <div className="form-group form-group--full">
                        <hr style={{ border: 'none', borderTop: '2px solid #e8f0fe', margin: '8px 0 16px 0' }} />
                        <div style={{
                          background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)',
                          borderRadius: '10px', padding: '12px 20px', marginBottom: '20px',
                          display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                          <i className="fas fa-briefcase" style={{ color: '#f0c040', fontSize: '18px' }}></i>
                          <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>
                            Información de la Empresa
                          </span>
                        </div>
                      </div>

                      {/* CONVENIO */}
                      <div className="form-group form-group--full">
                        <label style={{ fontWeight: 500 }}>
                          ¿La solicitud hace parte de algún convenio?
                          <span className="field-hint" style={{ marginLeft: 8 }}>
                            (Escribe el nombre o déjalo vacío si no aplica)
                          </span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-handshake" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f', fontSize: '15px'
                          }}></i>
                          <input type="text" className="form__input"
                            placeholder="Ej: Convenio SENA - Alcaldía 2024"
                            value={infoEmpresa.cual_convenio}
                            onChange={e => updateEmpresa('cual_convenio', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* NOMBRE */}
                      <div className="form-group">
                        <label>Nombre de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-building" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="text" className="form__input"
                            value={infoEmpresa.nombre_empresa}
                            onChange={e => updateEmpresa('nombre_empresa', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* NIT */}
                      <div className="form-group">
                        <label>NIT de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-id-card" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="text" className="form__input" placeholder="Ej: 900123456-1"
                            value={infoEmpresa.nit_empresa}
                            onChange={e => updateEmpresa('nit_empresa', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* FECHA CREACIÓN */}
                      <div className="form-group">
                        <label>Fecha de creación</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-calendar-alt" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="date" className="form__input"
                            value={infoEmpresa.fecha_creacion}
                            onChange={e => updateEmpresa('fecha_creacion', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* TIPO EMPRESA — catálogo desde BD */}
                      <div className="form-group">
                        <label>Tipo de empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-tags" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f', zIndex: 1
                          }}></i>
                          <select className="form__select" value={infoEmpresa.tipo_empresa}
                            onChange={e => updateEmpresa('tipo_empresa', e.target.value)}
                            style={{ paddingLeft: '38px' }}>
                            <option value="">Selecciona tipo de empresa...</option>
                            {tiposEmpresa.map(t => (
                              <option key={t._id} value={t._id}>{t.nombre}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* DIRECCIÓN */}
                      <div className="form-group form-group--full">
                        <label>Dirección de la empresa</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-map-marker-alt" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="text" className="form__input" placeholder="Calle, carrera, barrio..."
                            value={infoEmpresa.direccion_empresa}
                            onChange={e => updateEmpresa('direccion_empresa', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* REPRESENTANTE LEGAL */}
                      <div className="form-group form-group--full">
                        <label>Nombre del representante legal</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-user-tie" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="text" className="form__input"
                            value={infoEmpresa.nombre_representante_legal}
                            onChange={e => updateEmpresa('nombre_representante_legal', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* CONTACTO */}
                      <div className="form-group form-group--full">
                        <label>Nombre completo del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-user" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="text" className="form__input"
                            value={infoEmpresa.nombre_contacto}
                            onChange={e => updateEmpresa('nombre_contacto', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* CELULAR */}
                      <div className="form-group">
                        <label>No. de celular del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-mobile-alt" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="tel" className="form__input" placeholder="Ej: 3001234567"
                            value={infoEmpresa.celular_contacto}
                            onChange={e => updateEmpresa('celular_contacto', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* CORREO */}
                      <div className="form-group">
                        <label>Correo electrónico del contacto</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-envelope" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="email" className="form__input" placeholder="contacto@empresa.com"
                            value={infoEmpresa.correo_contacto}
                            onChange={e => updateEmpresa('correo_contacto', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
                        </div>
                      </div>

                      {/* EMPLEADOS */}
                      <div className="form-group">
                        <label>Número de empleados</label>
                        <div style={{ position: 'relative' }}>
                          <i className="fas fa-users" style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', color: '#2d6a9f'
                          }}></i>
                          <input type="number" className="form__input" min={1}
                            value={infoEmpresa.numero_empleados}
                            onChange={e => updateEmpresa('numero_empleados', e.target.value)}
                            style={{ paddingLeft: '38px' }} />
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
                    <select className={`form__select ${errores.departamento ? 'error' : ''}`}
                      value={departamento}
                      onChange={e => { setDepartamento(e.target.value); setMunicipio(''); }}>
                      <option value="">Selecciona departamento</option>
                      {departamentos.map(d => <option key={d._id} value={d._id}>{d.nombre}</option>)}
                    </select>
                    {errores.departamento && <span className="field-error">{errores.departamento}</span>}
                  </div>

                  <div className="form-group">
                    <label className="required">Municipio</label>
                    <select className={`form__select ${errores.municipio ? 'error' : ''}`}
                      value={municipio} onChange={e => setMunicipio(e.target.value)} disabled={!departamento}>
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
                    <input type="text" className="form__input"
                      placeholder="Ej: Aula 201, Taller mecánico..."
                      value={ambiente} onChange={e => setAmbiente(e.target.value)} />
                  </div>

                  <div className="form-group form-group--full">
                    <label className="required">Dirección</label>
                    <input type="text" className={`form__input ${errores.direccion ? 'error' : ''}`}
                      placeholder="Calle, carrera, barrio..."
                      value={direccion} onChange={e => setDireccion(e.target.value)} />
                    {errores.direccion && <span className="field-error">{errores.direccion}</span>}
                  </div>

                </div>
              </div>
            )}

            {/* ══ HORARIO ══ */}
            {tabActiva === 'horario' && (() => {
              const horasPorSemana = horarios.reduce((total, h) => {
                const [hi, mi] = h.hora_inicio.split(':').map(Number);
                const [hf, mf] = h.hora_fin.split(':').map(Number);
                const diff = (hf * 60 + mf) - (hi * 60 + mi);
                return total + (diff > 0 ? diff / 60 : 0);
              }, 0);
              const semanasNecesarias = horasPorSemana > 0 && duracion ? Math.ceil(Number(duracion) / horasPorSemana) : 0;
              const fechaTermEstimada = fechaInicio && semanasNecesarias > 0
                ? (() => { const d = new Date(fechaInicio + 'T12:00:00'); d.setDate(d.getDate() + semanasNecesarias * 7); return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }); })()
                : '—';

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
                        { label: 'Horas programadas por semana:', valor: `${horasPorSemana.toFixed(2)} horas` },
                        { label: 'Fecha de terminación estimada:', valor: fechaTermEstimada },
                        { label: 'Semanas necesarias:', valor: semanasNecesarias || '—' },
                      ].map(({ label, valor }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #e2edf7', borderRadius: '8px', padding: '12px 16px', gap: '10px' }}>
                          <span style={{ color: '#555', fontSize: '13px' }}>{label}</span>
                          <span style={{ background: '#e8f0fe', color: '#1a3a5c', fontWeight: 700, borderRadius: '20px', padding: '3px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}>{valor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="field-hint" style={{ marginBottom: '20px' }}>Selecciona los días y define el horario para cada uno.</p>

                  {/* Tarjetas días */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {DIAS.map(dia => {
                      const h = horarios.find(x => x.dia === dia);
                      return (
                        <div key={dia} style={{ border: h ? '2px solid #2d6a9f' : '1.5px solid #dce8f5', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: h ? '0 2px 10px rgba(45,106,159,0.12)' : '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                          <div onClick={() => toggleDia(dia)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: h ? 'linear-gradient(135deg, #1a3a5c, #2d6a9f)' : '#f4f8fd', cursor: 'pointer', userSelect: 'none' }}>
                            <span style={{ fontWeight: 600, fontSize: '15px', color: h ? '#fff' : '#1a3a5c' }}>{dia}</span>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: h ? '#4caf50' : '#fff', border: h ? '2px solid #4caf50' : '2px solid #bcd0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {h && <i className="fas fa-check" style={{ color: '#fff', fontSize: '11px' }}></i>}
                            </div>
                          </div>
                          {h ? (
                            <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora inicio</label>
                                <input type="time" className="form__input" value={h.hora_inicio} onChange={e => actualizarHorario(dia, 'hora_inicio', e.target.value)} style={{ fontSize: '14px', padding: '8px 10px' }} />
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hora fin</label>
                                <input type="time" className="form__input" value={h.hora_fin} onChange={e => actualizarHorario(dia, 'hora_fin', e.target.value)} style={{ fontSize: '14px', padding: '8px 10px' }} />
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: '18px', textAlign: 'center', color: '#aac0d8', fontSize: '13px' }}>Click para agregar horario</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
    </div>
  );
};

export default CrearOferta;