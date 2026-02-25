import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onKeyDown = (e) => { if (e.key === "Enter") submit(); };

  const submit = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) return setMsg({ type: "error", text: data.msg });

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({
        _id: data._id,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        rol: data.rol,
      }));
      window.dispatchEvent(new Event("localStorageUpdated"));

      if (data.rol === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/inicio");
      }
    } catch {
      setMsg({ type: "error", text: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span>S</span> Klassroom
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido. Ingresa tus credenciales:</p>
        </div>

        <div className="auth-form">
          {msg && <div className={`auth-message ${msg.type}`}>{msg.text}</div>}

          <div className="auth-field">
            <label>Correo Electrónico</label>
            <div className="auth-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                name="email"
                type="email"
                placeholder="usuario@sena.edu.co"
                value={form.email}
                onChange={handle}
                onKeyDown={onKeyDown}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Contraseña</label>
            <div className="auth-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={form.password}
                onChange={handle}
                onKeyDown={onKeyDown}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button className="auth-button" onClick={submit} disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </button>

          <div className="auth-links">
            <button type="button" className="auth-link" onClick={() => navigate("/register")}>
              Crear cuenta
             
            </button>
            <button type="button" className="auth-link" onClick={() => navigate("/forgot")}>
               ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;