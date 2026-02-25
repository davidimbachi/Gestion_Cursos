import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    return setMsg({ type: "error", text: "Las contraseñas no coinciden." });
  }

  setMsg(null);
  setLoading(true);

  try {
    const res = await fetch(`${API}/usuarios/nuevo-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    // 🔐 leer como texto primero
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Respuesta inválida del servidor");
    }

    if (!res.ok) {
      throw new Error(data.msg || "Error al actualizar la contraseña");
    }

    setMsg({ type: "success", text: data.msg });

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (error) {
    setMsg({ type: "error", text: error.message });
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
          <h2>Restablecer contraseña</h2>
          <p>Ingresa tu nueva contraseña.</p>
        </div>

        <div className="auth-form">
          {msg && <div className={`auth-message ${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Nueva contraseña</label>
              <div className="auth-input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Confirmar contraseña</label>
              <div className="auth-input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>

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

export default ResetPassword;