// components/login/ForgotPassword.jsx
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

/* ── ForgotPassword ─────────────────────── */
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email,   setEmail]   = useState("");
  const [msg,     setMsg]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const onKeyDown = (e) => { if (e.key === "Enter") submit(); };

  const submit = async () => {
    if (!email.trim())
      return setMsg({ type: "error", text: "Ingresa tu correo electrónico." });

    setMsg(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API}/usuarios/olvide-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) return setMsg({ type: "error", text: data.msg });

      setSent(true);
      setMsg({
        type: "success",
        text: "Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña.",
      });

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
            <h2>Recuperar contraseña</h2>
            <p>Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.</p>
          </div>

          <div className="auth-form">

            {msg && <div className={`auth-alert ${msg.type}`}>{msg.text}</div>}

            {!sent && (
              <>
                <div className="form-field">
                  <label>Correo Electrónico</label>
                  <div className="input-wrap">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
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

                <button className="btn-primary" onClick={submit} disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instrucciones"}
                </button>
              </>
            )}

            <p className="auth-alt-link">
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                onClick={() => navigate("/login")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Volver al inicio de sesión
              </span>
            </p>

          </div>
        </div>

        <RightPanel />
      </div>
    </div>
  );
};

export default ForgotPassword;