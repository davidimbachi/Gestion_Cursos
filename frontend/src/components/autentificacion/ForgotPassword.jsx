import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onKeyDown = (e) => { if (e.key === "Enter") submit(); };

  const submit = async () => {
    if (!email.trim())
      return setMsg({ type: "error", text: "Ingresa tu correo electrónico." });

    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/usuarios/olvide-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) return setMsg({ type: "error", text: data.msg });

      // Éxito: mostrar mensaje de revisar correo
      setMsg({
        type: "success",
        text: "Hemos enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada.",
      });
      // No redirigir automáticamente
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
          <h2>Recuperar contraseña</h2>
          <p>Ingresa tu correo para restablecer tu contraseña.</p>
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
                type="email"
                placeholder="usuario@sena.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="email"
              />
            </div>
          </div>

          <button className="auth-button" onClick={submit} disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>

          <div className="auth-links">
            <button type="button" className="auth-link" onClick={() => navigate("/login")}>
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;