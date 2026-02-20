import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CrearOferta.css';

const API = 'http://localhost:4000/api';

const DURACIONES = [40, 60, 80, 120, 160, 200, 240, 300, 360, 400, 480, 600, 800, 880, 1200, 1600, 1760, 2640, 3520];
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const tabsConfig = [
  { key: 'programa',  label: 'Programa',  icon: 'fa-book' },
  { key: 'oferta',    label: 'Oferta',    icon: 'fa-tag' },
  { key: 'empresa',   label: 'Empresa',   icon: 'fa-building' },
  { key: 'ubicacion', label: 'Ubicación', icon: 'fa-map-marker-alt' },
  { key: 'horario',   label: 'Horario',   icon: 'fa-clock' },
];

const CrearOferta = () => {
  const [tabActiva, setTabActiva] = useState('programa');
  const [enviando, setEnviando]   = useState(false);
  const [exito, setExito]         = useState(false);
  const [errores, setErrores]     = useState({});

  // ── Tab Programa ──────────────────────────────────────────────────────────
  const [duracion, setDuracion]                         = useState('');
  const [programas, setProgramas]                       = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');
  const [busquedaPrograma, setBusquedaPrograma]         = useState('');
  const [cargandoProgs, setCargandoProgs]               = useState(false);
  const [modalidades, setModalidades]                   = useState([]);
  const [modalidadPrograma, setModalidadPrograma]       = useState('');

  // ── Tab Oferta ────────────────────────────────────────────────────────────
  const [modalidadOferta, setModalidadOferta]       = useState('REGULAR');
  const [tipoOferta, setTipoOferta]                 = useState('ABIERTA');
  const [cupo, setCupo]                             = useState(25);
  const [fechaInicio, setFechaInicio]               = useState('');
  const [fechaTerminacion, setFechaTerminacion]     = useState('');
  const [fechaInscripcion, setFechaInscripcion]     = useState('');
  const [codigoFicha, setCodigoFicha]               = useState('');
  const [codigoSolicitud, setCodigoSolicitud]       = useState('');
  const [programasEspeciales, setProgramasEspeciales] = useState([]);
  const [programaEspecial, setProgramaEspecial]     = useState('');

  // ── Tab Empresa ───────────────────────────────────────────────────────────
  const [empresas, setEmpresas]                       = useState([]);
  const [busquedaEmpresa, setBusquedaEmpresa]         = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');

  // ── Tab Ubicación ─────────────────────────────────────────────────────────
  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento]   = useState('');
  const [municipios, setMunicipios]       = useState([]);
  const [municipio, setMunicipio]         = useState('');
  const [ambiente, setAmbiente]           = useState('');
  const [direccion, setDireccion]         = useState('');

  // ── Tab Horario ───────────────────────────────────────────────────────────
  const [horarios, setHorarios] = useState([]);

  // ── Carga de datos ────────────────────────────────────────────────────────

  // Buscar programas por texto y duración
  useEffect(() => {
    if (!duracion) { setProgramas([]); return; }
    if (!busquedaPrograma || busquedaPrograma.length < 2) { setProgramas([]); return; }
    setCargandoProgs(true);
    axios.get(`${API}/programas/buscar?duracion=${duracion}&texto=${busquedaPrograma}`)
      .then(r => setProgramas(r.data))
      .catch(console.error)
      .finally(() => setCargandoProgs(false));
  }, [duracion, busquedaPrograma]);

  // Modalidades de programa
  useEffect(() => {
    axios.get(`${API}/catalogos/modalidades`)
      .then(r => setModalidades(r.data))
      .catch(console.error);
  }, []);

  // Programas especiales
  useEffect(() => {
    axios.get(`${API}/catalogos/programas-especiales`)
      .then(r => setProgramasEspeciales(r.data))
      .catch(console.error);
  }, []);

  // Empresas (con búsqueda)
  useEffect(() => {
    axios.get(`${API}/empresas${busquedaEmpresa ? `?q=${busquedaEmpresa}` : ''}`)
      .then(r => setEmpresas(r.data))
      .catch(console.error);
  }, [busquedaEmpresa]);

  // Departamentos
  useEffect(() => {
    axios.get(`${API}/ubicacion/departamentos`)
      .then(r => setDepartamentos(r.data))
      .catch(console.error);
  }, []);

  // Municipios según departamento
  useEffect(() => {
    if (!departamento) { setMunicipios([]); setMunicipio(''); return; }
    axios.get(`${API}/ubicacion/municipios?departamento=${departamento}`)
      .then(r => setMunicipios(r.data))
      .catch(console.error);
  }, [departamento]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const tabIndex = tabsConfig.findIndex(t => t.key === tabActiva);
  const progreso = Math.round(((tabIndex + 1) / tabsConfig.length) * 100);
  const irTab = (dir) => {
    const idx = tabIndex + dir;
    if (idx >= 0 && idx < tabsConfig.length) setTabActiva(tabsConfig[idx].key);
  };

  // ── Horarios ──────────────────────────────────────────────────────────────
  const toggleDia = (dia) => {
    const existe = horarios.find(h => h.dia === dia);
    if (existe) {
      setHorarios(horarios.filter(h => h.dia !== dia));
    } else {
      setHorarios([...horarios, { dia, hora_inicio: '07:00', hora_fin: '09:00' }]);
    }
  };

  const actualizarHorario = (dia, campo, valor) => {
    setHorarios(horarios.map(h => h.dia === dia ? { ...h, [campo]: valor } : h));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = {};
    if (!programaSeleccionado)   errs.programa         = 'Selecciona un programa';
    if (!fechaInicio)            errs.fechaInicio      = 'Requerida';
    if (!fechaInscripcion)       errs.fechaInscripcion = 'Requerida';
    if (!departamento)           errs.departamento     = 'Selecciona departamento';
    if (!municipio)              errs.municipio        = 'Selecciona municipio';
    if (!direccion)              errs.direccion        = 'Ingresa una dirección';

    if (Object.keys(errs).length) {
      setErrores(errs);
      if (errs.programa) setTabActiva('programa');
      else if (errs.fechaInicio || errs.fechaInscripcion) setTabActiva('oferta');
      else if (errs.departamento || errs.municipio || errs.direccion) setTabActiva('ubicacion');
      return;
    }

    setEnviando(true);
    try {
      const lugarRes = await axios.post(`${API}/ubicacion/lugares`, {
        departamento, municipio, ambiente, direccion,
      });

      await axios.post(`${API}/ofertas`, {
        programa: programaSeleccionado,
        modalidad_programa: modalidadPrograma || undefined,
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
    setModalidadPrograma(''); setModalidadOferta('REGULAR'); setTipoOferta('ABIERTA');
    setCupo(25); setFechaInicio(''); setFechaTerminacion(''); setFechaInscripcion('');
    setCodigoFicha(''); setCodigoSolicitud(''); setProgramaEspecial('');
    setEmpresaSeleccionada(''); setBusquedaEmpresa('');
    setDepartamento(''); setMunicipio(''); setAmbiente(''); setDireccion('');
    setHorarios([]); setErrores({});
  };

  // ── Pantalla de éxito ─────────────────────────────────────────────────────
  if (exito) return (
    <div className="dashboard-content">
      <div className="oferta-page">
        <div className="oferta__card oferta__exito">
          <i className="fas fa-check-circle"></i>
          <h2>¡Oferta creada correctamente!</h2>
          <button className="btn btn--primary" onClick={resetForm}>
            Crear otra oferta
          </button>
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-content">
      <div className="oferta-page">
        <div className="oferta__card">

          {/* Tabs */}
          <div className="oferta__header">
            <div className="oferta__tabs">
              {tabsConfig.map(t => (
                <div
                  key={t.key}
                  className={`oferta__tab ${tabActiva === t.key ? 'active' : ''}`}
                  onClick={() => setTabActiva(t.key)}
                >
                  <i className={`fas ${t.icon}`}></i> {t.label}
                </div>
              ))}
            </div>
            <div className="oferta__progress">
              <div className="oferta__progress-bar" style={{ width: `${progreso}%` }}></div>
            </div>
          </div>

          <div className="oferta__content">

            {/* ══ PROGRAMA ══════════════════════════════════════════════════ */}
            {tabActiva === 'programa' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-book"></i> Información del Programa
                </h2>
                <div className="form-section__grid">

                  <div className="form-group">
                    <label className="required">Duración del programa</label>
                    <select
                      className="form__select"
                      value={duracion}
                      onChange={e => {
                        setDuracion(e.target.value);
                        setProgramaSeleccionado('');
                        setBusquedaPrograma('');
                        setProgramas([]);
                      }}
                    >
                      <option value="">Selecciona duración</option>
                      {DURACIONES.map(d => <option key={d} value={d}>{d} horas</option>)}
                    </select>
                  </div>

                  {duracion && (
                    <div className="form-group form-group--full">
                      <label className="required">Programa</label>
                      <input
                        type="text"
                        className={`form__input ${errores.programa ? 'error' : ''}`}
                        placeholder="Escribe para buscar programa..."
                        value={busquedaPrograma}
                        onChange={e => {
                          setBusquedaPrograma(e.target.value);
                          setProgramaSeleccionado('');
                        }}
                      />
                      {cargandoProgs && <span className="field-hint">Buscando...</span>}
                      {programas.length > 0 && !programaSeleccionado && (
                        <div className="programa__lista">
                          {programas.map(p => (
                            <div
                              key={p._id}
                              className="programa__item"
                              onClick={() => {
                                setProgramaSeleccionado(p._id);
                                setBusquedaPrograma(`${p.nombre} ${p.codigo ? `(${p.codigo})` : ''} — ${p.duracion}h`);
                                setProgramas([]);
                              }}
                            >
                              {p.nombre} {p.codigo ? `(${p.codigo})` : ''} — {p.duracion}h
                            </div>
                          ))}
                        </div>
                      )}
                      {errores.programa && <span className="field-error">{errores.programa}</span>}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Modalidad del programa</label>
                    <select
                      className="form__select"
                      value={modalidadPrograma}
                      onChange={e => setModalidadPrograma(e.target.value)}
                    >
                      <option value="">Selecciona modalidad</option>
                      {modalidades.map(m => (
                        <option key={m._id} value={m._id}>{m.nombre}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            )}

            {/* ══ OFERTA ════════════════════════════════════════════════════ */}
            {tabActiva === 'oferta' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-tag"></i> Detalles de la Oferta
                </h2>
                <div className="form-section__grid">

                  <div className="form-group">
                    <label className="required">Modalidad de oferta</label>
                    <select className="form__select" value={modalidadOferta} onChange={e => setModalidadOferta(e.target.value)}>
                      <option value="REGULAR">Regular</option>
                      <option value="CAMPESENA">Campesena</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="required">Tipo de oferta</label>
                    <select className="form__select" value={tipoOferta} onChange={e => setTipoOferta(e.target.value)}>
                      <option value="ABIERTA">Abierta</option>
                      <option value="CERRADA">Cerrada</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="required">Cupo</label>
                    <input type="number" className="form__input" value={cupo} min={1} onChange={e => setCupo(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="required">Fecha de inicio</label>
                    <input
                      type="date"
                      className={`form__input ${errores.fechaInicio ? 'error' : ''}`}
                      value={fechaInicio}
                      onChange={e => setFechaInicio(e.target.value)}
                    />
                    {errores.fechaInicio && <span className="field-error">{errores.fechaInicio}</span>}
                  </div>

                  <div className="form-group">
                    <label>Fecha de terminación</label>
                    <input type="date" className="form__input" value={fechaTerminacion} onChange={e => setFechaTerminacion(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="required">Fecha de inscripción</label>
                    <input
                      type="date"
                      className={`form__input ${errores.fechaInscripcion ? 'error' : ''}`}
                      value={fechaInscripcion}
                      onChange={e => setFechaInscripcion(e.target.value)}
                    />
                    {errores.fechaInscripcion && <span className="field-error">{errores.fechaInscripcion}</span>}
                  </div>

                  <div className="form-group">
                    <label>Código de ficha</label>
                    <input type="text" className="form__input" value={codigoFicha} onChange={e => setCodigoFicha(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Código de solicitud</label>
                    <input type="text" className="form__input" value={codigoSolicitud} onChange={e => setCodigoSolicitud(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Programa especial</label>
                    <select className="form__select" value={programaEspecial} onChange={e => setProgramaEspecial(e.target.value)}>
                      <option value="">Ninguno</option>
                      {programasEspeciales.map(p => (
                        <option key={p._id} value={p._id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            )}

            {/* ══ EMPRESA ═══════════════════════════════════════════════════ */}
            {tabActiva === 'empresa' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-building"></i> Empresa Solicitante
                </h2>
                <div className="form-section__grid">

                  <div className="form-group form-group--full">
                    <label>Buscar empresa por nombre</label>
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Escribe el nombre..."
                      value={busquedaEmpresa}
                      onChange={e => setBusquedaEmpresa(e.target.value)}
                    />
                  </div>

                  <div className="form-group form-group--full">
                    <label>Empresa solicitante <span className="field-hint">(opcional para ofertas abiertas)</span></label>
                    <select
                      className="form__select"
                      value={empresaSeleccionada}
                      onChange={e => setEmpresaSeleccionada(e.target.value)}
                    >
                      <option value="">Sin empresa</option>
                      {empresas.map(e => (
                        <option key={e._id} value={e._id}>
                          {e.nombre} {e.nit ? `— NIT: ${e.nit}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>
            )}

            {/* ══ UBICACIÓN ═════════════════════════════════════════════════ */}
            {tabActiva === 'ubicacion' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-map-marker-alt"></i> Ubicación
                </h2>
                <div className="form-section__grid">

                  <div className="form-group">
                    <label className="required">Departamento</label>
                    <select
                      className={`form__select ${errores.departamento ? 'error' : ''}`}
                      value={departamento}
                      onChange={e => { setDepartamento(e.target.value); setMunicipio(''); }}
                    >
                      <option value="">Selecciona departamento</option>
                      {departamentos.map(d => <option key={d._id} value={d._id}>{d.nombre}</option>)}
                    </select>
                    {errores.departamento && <span className="field-error">{errores.departamento}</span>}
                  </div>

                  <div className="form-group">
                    <label className="required">Municipio</label>
                    <select
                      className={`form__select ${errores.municipio ? 'error' : ''}`}
                      value={municipio}
                      onChange={e => setMunicipio(e.target.value)}
                      disabled={!departamento}
                    >
                      <option value="">Selecciona municipio</option>
                      {municipios.map(m => <option key={m._id} value={m._id}>{m.nombre}</option>)}
                    </select>
                    {errores.municipio && <span className="field-error">{errores.municipio}</span>}
                  </div>

                  <div className="form-group">
                    <label>Ambiente / Instalación</label>
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Ej: Aula 201, Taller mecánico..."
                      value={ambiente}
                      onChange={e => setAmbiente(e.target.value)}
                    />
                  </div>

                  <div className="form-group form-group--full">
                    <label className="required">Dirección</label>
                    <input
                      type="text"
                      className={`form__input ${errores.direccion ? 'error' : ''}`}
                      placeholder="Calle, carrera, barrio..."
                      value={direccion}
                      onChange={e => setDireccion(e.target.value)}
                    />
                    {errores.direccion && <span className="field-error">{errores.direccion}</span>}
                  </div>

                </div>
              </div>
            )}

            {/* ══ HORARIO ═══════════════════════════════════════════════════ */}
            {tabActiva === 'horario' && (
              <div className="form-section active">
                <h2 className="form-section__title">
                  <i className="fas fa-clock"></i> Horario
                </h2>
                <p className="field-hint">Selecciona los días y define el horario para cada uno.</p>

                <div className="horario__dias">
                  {DIAS.map(dia => {
                    const h = horarios.find(x => x.dia === dia);
                    return (
                      <div key={dia} className={`horario__dia-card ${h ? 'active' : ''}`}>
                        <div className="horario__dia-header" onClick={() => toggleDia(dia)}>
                          <span className="horario__dia-nombre">{dia}</span>
                          <i className={`fas ${h ? 'fa-check-circle' : 'fa-circle'}`}></i>
                        </div>
                        {h && (
                          <div className="horario__dia-body">
                            <div className="form-group">
                              <label>Hora inicio</label>
                              <input
                                type="time"
                                className="form__input"
                                value={h.hora_inicio}
                                onChange={e => actualizarHorario(dia, 'hora_inicio', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Hora fin</label>
                              <input
                                type="time"
                                className="form__input"
                                value={h.hora_fin}
                                onChange={e => actualizarHorario(dia, 'hora_fin', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {horarios.length > 0 && (
                  <div className="horario__resumen">
                    <h3>Resumen</h3>
                    {horarios.map(h => (
                      <div key={h.dia} className="horario__resumen-item">
                        <strong>{h.dia}:</strong> {h.hora_inicio} – {h.hora_fin}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="oferta__footer">
            <button
              className="btn btn--secondary"
              onClick={() => irTab(-1)}
              disabled={tabIndex === 0}
            >
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
