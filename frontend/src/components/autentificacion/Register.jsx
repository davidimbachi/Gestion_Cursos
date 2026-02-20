// components/login/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/* ── Panel derecho ─────────────────────── */
const RightPanel = () => (
  <div className="auth-right">
    <div className="auth-right-stripe" />
    <div className="auth-right-brand">
      <div className="auth-right-badge">S</div>
      <span>SENA · Klassroom</span>
    </div>
    <h3 className="auth-right-title">Gestiona y mejora tus cursos online</h3>
    <p className="auth-right-sub">
      Administra inscripciones, documentos y más, todo en un solo lugar.
    </p>
    <div className="auth-right-features">
      {[
        { text: "Inscripciones en segundos",  icon: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" },
        { text: "Gestión de documentos",       icon: "M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
        { text: "Control de roles y permisos", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
      ].map((f, i) => (
        <div className="auth-right-feature-item" key={i}>
          <div className="auth-right-feature-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={f.icon} />
            </svg>
          </div>
          {f.text}
        </div>
      ))}
    </div>
  </div>
);

/* ── Constantes ─────────────────────────── */
const ROLES    = ["Aprendiz", "Instructor", "Coordinador", "Funcionario"];
const TIPOS_ID = ["CC", "TI", "CE", "Pasaporte"];

/* ── Icono SVG genérico ─────────────────── */
const Ico = ({ d, extra }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
    {extra}
  </svg>
);

/* ── Register ──────────────────────────── */
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username:              "",
    email:                 "",
    password:              "",
    confirmPassword:       "",
    first_name:            "",
    last_name:             "",
    telefono:              "",
    tipo_identificacion:   "CC",
    numero_identificacion: "",
    rol:                   "Aprendiz",
    tipo_programa:         "",
    coordinador:           "",
  });

  const [firma,        setFirma]        = useState(null);
  const [instructores, setInstructores] = useState([]);
  const [loadingInst,  setLoadingInst]  = useState(false);
  const [msg,          setMsg]          = useState(null);
  const [loading,      setLoading]      = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* Cargar instructores cuando cambia tipo_programa */
  useEffect(() => {
    if (form.rol !== "Instructor" || !form.tipo_programa) {
      setInstructores([]);
      return;
    }
    const fetchInstructores = async () => {
      setLoadingInst(true);
      setForm((f) => ({ ...f, coordinador: "" }));
      try {
        const res  = await fetch(`${API}/usuarios?rol=Instructor&tipo_programa=${form.tipo_programa}`);
        const data = await res.json();
        setInstructores(Array.isArray(data) ? data : []);
      } catch {
        setInstructores([]);
      } finally {
        setLoadingInst(false);
      }
    };
    fetchInstructores();
  }, [form.tipo_programa, form.rol]);

  const handleRol = (e) => {
    setForm((f) => ({ ...f, rol: e.target.value, tipo_programa: "", coordinador: "" }));
    setInstructores([]);
  };

  const selectTipo = (tipo) => {
    setForm((f) => ({ ...f, tipo_programa: tipo, coordinador: "" }));
  };

  const submit = async () => {
    setMsg(null);

    if (form.password !== form.confirmPassword)
      return setMsg({ type: "error", text: "Las contraseñas no coinciden." });
    if (form.rol === "Instructor" && !form.tipo_programa)
      return setMsg({ type: "error", text: "Selecciona el tipo de programa." });
    if (form.rol === "Instructor" && !form.coordinador)
      return setMsg({ type: "error", text: "Selecciona un instructor coordinador." });

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      if (firma) fd.append("firma_digital", firma);

      const res  = await fetch(`${API}/usuarios/registrar`, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) return setMsg({ type: "error", text: data.msg });

      setMsg({ type: "success", text: data.msg });
      setTimeout(() => navigate("/login"), 2500);

    } catch {
      setMsg({ type: "error", text: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card wide">

        <div className="auth-left scrollable">

          <div className="auth-logo">
            <div className="auth-logo-icon">S</div>
            Klassroom
          </div>

          <div className="auth-heading">
            <h2>Crear cuenta</h2>
            <p>Completa tu información para registrarte</p>
          </div>

          <div className="auth-form">

            {msg && <div className={`auth-alert ${msg.type}`}>{msg.text}</div>}

            {/* Nombre y Apellido */}
            <div className="form-grid-2">
              <div className="form-field">
                <label>Nombre</label>
                <div className="input-wrap">
                  <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                  <input name="first_name" placeholder="María" value={form.first_name} onChange={handle} />
                </div>
              </div>
              <div className="form-field">
                <label>Apellido</label>
                <div className="input-wrap">
                  <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                  <input name="last_name" placeholder="García" value={form.last_name} onChange={handle} />
                </div>
              </div>
            </div>

            {/* Usuario */}
            <div className="form-field">
              <label>Nombre de usuario</label>
              <div className="input-wrap">
                <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                <input name="username" placeholder="mgarcia" value={form.username} onChange={handle} autoComplete="username" />
              </div>
            </div>

            {/* Correo */}
            <div className="form-field">
              <label>Correo Electrónico</label>
              <div className="input-wrap">
                <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" extra={<polyline points="22,6 12,13 2,6"/>} />
                <input name="email" type="email" placeholder="correo@sena.edu.co" value={form.email} onChange={handle} autoComplete="email" />
              </div>
            </div>

            {/* Teléfono */}
            <div className="form-field">
              <label>Teléfono</label>
              <div className="input-wrap">
                <Ico d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6z" />
                <input name="telefono" placeholder="300 000 0000" value={form.telefono} onChange={handle} />
              </div>
            </div>

            {/* Tipo y número de ID */}
            <div className="form-grid-2">
              <div className="form-field">
                <label>Tipo de identificación</label>
                <div className="input-wrap">
                  <Ico d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM8 12a2 2 0 100-4 2 2 0 000 4zM14 9h4M14 12h4M14 15h2" />
                  <select name="tipo_identificacion" value={form.tipo_identificacion} onChange={handle}>
                    {TIPOS_ID.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Número de identificación</label>
                <div className="input-wrap">
                  <Ico d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM8 12a2 2 0 100-4 2 2 0 000 4zM14 9h4M14 12h4M14 15h2" />
                  <input name="numero_identificacion" placeholder="12345678" value={form.numero_identificacion} onChange={handle} />
                </div>
              </div>
            </div>

            {/* Rol */}
            <div className="form-field">
              <label>Rol solicitado</label>
              <div className="input-wrap">
                <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                <select name="rol" value={form.rol} onChange={handleRol}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* ── Sección Instructor ── */}
            {form.rol === "Instructor" && (
              <>
                <div className="form-field">
                  <label>Tipo de programa</label>
                  <div className="radio-group">
                    {["Regular", "Campe"].map((tipo) => (
                      <div
                        key={tipo}
                        className={`radio-opt${form.tipo_programa === tipo ? " active" : ""}`}
                        onClick={() => selectTipo(tipo)}
                      >
                        <div className="radio-dot" />
                        {tipo === "Campe"
                          ? <><span>Campe</span><span className="badge-sena">SENA</span></>
                          : tipo
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {form.tipo_programa && (
                  <div className="form-field">
                    <label>
                      Instructor coordinador —{" "}
                      <span style={{ fontWeight: 400, color: "var(--color-muted)", fontSize: 12 }}>
                        Programa {form.tipo_programa === "Campe" ? "CampeSENA" : "Regular"}
                      </span>
                    </label>
                    <div className="input-wrap">
                      <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                      <select name="coordinador" value={form.coordinador} onChange={handle} disabled={loadingInst}>
                        <option value="">
                          {loadingInst ? "Cargando instructores..." : "Selecciona un instructor"}
                        </option>
                        {instructores.map((inst) => (
                          <option key={inst._id} value={inst._id}>
                            {inst.first_name} {inst.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Contraseñas */}
            <div className="form-grid-2">
              <div className="form-field">
                <label>Contraseña</label>
                <div className="input-wrap">
                  <Ico d="M7 11V7a5 5 0 0110 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2"/>} />
                  <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} autoComplete="new-password" />
                </div>
              </div>
              <div className="form-field">
                <label>Confirmar contraseña</label>
                <div className="input-wrap">
                  <Ico d="M7 11V7a5 5 0 0110 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2"/>} />
                  <input name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handle} autoComplete="new-password" />
                </div>
              </div>
            </div>

            {/* Firma digital */}
            <div className="form-field">
              <label>Firma digital (imagen)</label>
              <input className="file-input" type="file" accept="image/*" onChange={(e) => setFirma(e.target.files[0])} />
            </div>

            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>

            <p className="auth-alt-link">
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => navigate("/login")}>Inicia sesión</span>
            </p>

          </div>
        </div>

        <RightPanel />
      </div>
    </div>
  );
};

export default Register;