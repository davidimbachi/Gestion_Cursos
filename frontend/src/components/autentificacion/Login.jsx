// components/login/Login.jsx
import { useState } from "react";
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

/* ── Login ─────────────────────────────── */
const Login = () => {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [msg, setMsg]         = useState(null);
  const [loading, setLoading] = useState(false);

  const handle    = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onKeyDown = (e) => { if (e.key === "Enter") submit(); };

  const submit = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/usuarios/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) return setMsg({ type: "error", text: data.msg });

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({
        _id: data._id, username: data.username, email: data.email, rol: data.rol,
      }));

      navigate("/dashboard"); // ← cambia por tu ruta principal

    } catch {
      setMsg({ type: "error", text: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">

        <div className="auth-left">
          <div className="auth-logo">
            <div className="auth-logo-icon">S</div>
            Klassroom
          </div>

          <div className="auth-heading">
            <h2>Iniciar Sesión</h2>
            <p>Bienvenido. Ingresa tus credenciales:</p>
          </div>

          <div className="auth-form">

            {msg && <div className={`auth-alert ${msg.type}`}>{msg.text}</div>}

            {/* Correo */}
            <div className="form-field">
              <label>Correo Electrónico</label>
              <div className="input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  name="email" type="email"
                  placeholder="usuario@sena.edu.co"
                  value={form.email}
                  onChange={handle}
                  onKeyDown={onKeyDown}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="form-field">
              <label>Contraseña</label>
              <div className="input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  name="password" type="password"
                  placeholder="Ingresa tu contraseña"
                  value={form.password}
                  onChange={handle}
                  onKeyDown={onKeyDown}
                  autoComplete="current-password"
                />
              </div>
              <span className="forgot-link" onClick={() => navigate("/forgot-password")}>
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </button>

            <p className="auth-alt-link">
              ¿No tienes cuenta?{" "}
              <span onClick={() => navigate("/register")}>Regístrate</span>
            </p>

          </div>
        </div>

        <RightPanel />
      </div>
    </div>
  );
};

export default Login;