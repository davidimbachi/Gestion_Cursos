import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ROLES    = ["Aprendiz", "Instructor", "Coordinador", "Funcionario"];
const TIPOS_ID = ["CC", "TI", "CE", "Pasaporte"];

const Ico = ({ d, extra }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d={d} />
    {extra}
  </svg>
);

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
    coordinadorAsignado:   "", 
  });

  const [firma,        setFirma]        = useState(null);
  const [coordinadores, setCoordinadores] = useState([]);
  const [loadingCoord,  setLoadingCoord]  = useState(false);
  const [msg,          setMsg]          = useState(null);
  const [loading,      setLoading]      = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (form.rol !== "Instructor" || !form.tipo_programa) {
      setCoordinadores([]);
      return;
    }
    const fetchCoordinadores = async () => {
      setLoadingCoord(true);
      setForm((f) => ({ ...f, coordinadorAsignado: "" }));
      try {
        const res  = await fetch(`${API}/usuarios/coordinadores?tipo_programa=${form.tipo_programa}`);
        const data = await res.json();
        setCoordinadores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetch coordinadores:", err);
        setCoordinadores([]);
      } finally {
        setLoadingCoord(false);
      }
    };
    fetchCoordinadores();
  }, [form.tipo_programa, form.rol]);

  const handleRol = (e) => {
    setForm((f) => ({ ...f, rol: e.target.value, tipo_programa: "", coordinadorAsignado: "" }));
    setCoordinadores([]);
  };

  const selectTipo = (tipo) => {
    setForm((f) => ({ ...f, tipo_programa: tipo, coordinadorAsignado: "" }));
  };

  const submit = async () => {
    setMsg(null);

    if (form.password !== form.confirmPassword)
      return setMsg({ type: "error", text: "Las contraseñas no coinciden." });
    if (form.rol === "Instructor" && !form.tipo_programa)
      return setMsg({ type: "error", text: "Selecciona el tipo de programa." });
    if (form.rol === "Instructor" && !form.coordinadorAsignado)
      return setMsg({ type: "error", text: "Selecciona un coordinador." });

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      if (firma) fd.append("firma_digital", firma);

      const res = await fetch(`${API}/usuarios/registro`, { method: "POST", body: fd });
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
        <div className="auth-header">
          <div className="auth-logo">
            <span>S</span> Klassroom
          </div>
          <h2>Crear cuenta</h2>
          <p>Completa tu información para registrarte</p>
        </div>

        <div className="auth-form scrollable">
          {msg && <div className={`auth-message ${msg.type}`}>{msg.text}</div>}

          <div className="form-grid-2">
            <div className="auth-field">
              <label>Nombre</label>
              <div className="auth-input-wrapper">
                <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                <input name="first_name" placeholder="María" value={form.first_name} onChange={handle} />
              </div>
            </div>
            <div className="auth-field">
              <label>Apellido</label>
              <div className="auth-input-wrapper">
                <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                <input name="last_name" placeholder="García" value={form.last_name} onChange={handle} />
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label>Nombre de usuario</label>
            <div className="auth-input-wrapper">
              <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
              <input name="username" placeholder="mgarcia" value={form.username} onChange={handle} autoComplete="username" />
            </div>
          </div>

          <div className="auth-field">
            <label>Correo Electrónico</label>
            <div className="auth-input-wrapper">
              <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" extra={<polyline points="22,6 12,13 2,6" />} />
              <input name="email" type="email" placeholder="correo@sena.edu.co" value={form.email} onChange={handle} autoComplete="email" />
            </div>
          </div>

          <div className="auth-field">
            <label>Teléfono</label>
            <div className="auth-input-wrapper">
              <Ico d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6z" />
              <input name="telefono" placeholder="300 000 0000" value={form.telefono} onChange={handle} />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="auth-field">
              <label>Tipo de identificación</label>
              <div className="auth-input-wrapper">
                <Ico d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM8 12a2 2 0 100-4 2 2 0 000 4zM14 9h4M14 12h4M14 15h2" />
                <select name="tipo_identificacion" value={form.tipo_identificacion} onChange={handle}>
                  {TIPOS_ID.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="auth-field">
              <label>Número de identificación</label>
              <div className="auth-input-wrapper">
                <Ico d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM8 12a2 2 0 100-4 2 2 0 000 4zM14 9h4M14 12h4M14 15h2" />
                <input name="numero_identificacion" placeholder="12345678" value={form.numero_identificacion} onChange={handle} />
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label>Rol solicitado</label>
            <div className="auth-input-wrapper">
              <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
              <select name="rol" value={form.rol} onChange={handleRol}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {form.rol === "Instructor" && (
            <>
              <div className="auth-field">
                <label>Tipo de programa</label>
                <div className="radio-group">
                  {["Regular", "Campesena"].map((tipo) => (
                    <div
                      key={tipo}
                      className={`radio-option ${form.tipo_programa === tipo ? "active" : ""}`}
                      onClick={() => selectTipo(tipo)}
                    >
                      <div className="radio-dot" />
                      {tipo === "Campesena"
                        ? <><span>Campe</span><span className="badge-sena">SENA</span></>
                        : tipo
                      }
                    </div>
                  ))}
                </div>
              </div>

              {form.tipo_programa && (
                <div className="auth-field">
                  <label>
                    Coordinador <span className="field-note">(Programa {form.tipo_programa === "Campesena" ? "CampeSENA" : "Regular"})</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <Ico d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                    <select name="coordinadorAsignado" value={form.coordinadorAsignado} onChange={handle} disabled={loadingCoord}>
                      <option value="">
                        {loadingCoord ? "Cargando coordinadores..." : "Selecciona un coordinador"}
                      </option>
                      {coordinadores.map((coord) => (
                        <option key={coord._id} value={coord._id}>
                          {coord.nombre 
                            ? coord.nombre 
                            : `${coord.first_name ?? ""} ${coord.last_name ?? ""}`.trim()
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="form-grid-2">
            <div className="auth-field">
              <label>Contraseña</label>
              <div className="auth-input-wrapper">
                <Ico d="M7 11V7a5 5 0 0110 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2" />} />
                <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} autoComplete="new-password" />
              </div>
            </div>
            <div className="auth-field">
              <label>Confirmar contraseña</label>
              <div className="auth-input-wrapper">
                <Ico d="M7 11V7a5 5 0 0110 0v4" extra={<rect x="3" y="11" width="18" height="11" rx="2" />} />
                <input name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handle} autoComplete="new-password" />
              </div>
            </div>
          </div>

          <div className="auth-field">
            <label>Firma digital (imagen)</label>
            <div className="file-input-wrapper">
              <input type="file" accept="image/*" id="firma" onChange={(e) => setFirma(e.target.files[0])} />
              <label htmlFor="firma" className="file-input-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
                {firma ? firma.name : "Seleccionar imagen"}
              </label>
            </div>
          </div>

          <button className="auth-button" onClick={submit} disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>

          <div className="auth-links">
            <button type="button" className="auth-link" onClick={() => navigate("/login")}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;