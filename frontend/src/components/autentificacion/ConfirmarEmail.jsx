import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ConfirmarEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmar = async () => {
      try {
        const res = await fetch(`${API}/usuarios/confirmar/${token}`);        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        setMsg({ type: "success", text: "¡Email confirmado exitosamente! Ya puedes iniciar sesión." });
      } catch (error) {
        setMsg({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    };
    confirmar();
  }, [token]);

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span>S</span> Klassroom
          </div>
          <h2>Confirmación de email</h2>
        </div>
        <div className="auth-form">
          {loading && <p>Verificando...</p>}
          {msg && <div className={`auth-message ${msg.type}`}>{msg.text}</div>}
          {msg && msg.type === "success" && (
            <button className="auth-button" onClick={() => navigate("/login")}>
              Ir a iniciar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmarEmail;