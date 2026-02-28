import { useState, useEffect } from "react";

// al usar los helpers centralizados evitamos duplicar lógica y mantener
// las URLs sincronizadas con el backend.
import {
  listarSolicitudesRol,
  aprobarSolicitudRol,
  rechazarSolicitudRol
} from "../../services/api";

const SolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [msg, setMsg]                 = useState(null);
  const [procesando, setProcesando]   = useState(null);
  const [tab, setTab]                 = useState("pendiente");
  const [search, setSearch]           = useState("");

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await listarSolicitudesRol();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch {
      setMsg({ type: "error", text: "Error al cargar solicitudes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarSolicitudes(); }, []);
  useEffect(() => {
    if (msg) { const t = setTimeout(() => setMsg(null), 4000); return () => clearTimeout(t); }
  }, [msg]);

  const accion = async (id, tipo) => {
    setProcesando(id + tipo);
    try {
      let data;
      if (tipo === "aprobar") {
        data = await aprobarSolicitudRol(id);
      } else if (tipo === "rechazar") {
        data = await rechazarSolicitudRol(id);
      }
      setMsg({ type: "success", text: data.msg });
      cargarSolicitudes();
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Error al procesar." });
    } finally { setProcesando(null); }
  };

  const rolConfig = (nombre) => {
    const map = {
      Instructor:    { bg: "#EEF2FF", color: "#3730A3", dot: "#6366F1" },
      Coordinador:   { bg: "#E0F2FE", color: "#0C4A6E", dot: "#0284C7" },
      Funcionario:   { bg: "#FAF5FF", color: "#581C87", dot: "#9333EA" },
      Administrador: { bg: "#FFF7ED", color: "#7C2D12", dot: "#EA580C" },
      Aprendiz:      { bg: "#F0FDF4", color: "#14532D", dot: "#16A34A" },
      Invitado:      { bg: "#F8FAFC", color: "#334155", dot: "#94A3B8" },
    };
    return map[nombre] || map.Invitado;
  };

  const avatarColor = (nombre) => {
    const map = {
      Instructor:    "#6366F1",
      Coordinador:   "#0284C7",
      Funcionario:   "#9333EA",
      Administrador: "#EA580C",
      Aprendiz:      "#16A34A",
      Invitado:      "#94A3B8",
    };
    return map[nombre] || "#94A3B8";
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  };

  const pendientes = solicitudes.filter(s => s.estado === "pendiente");
  const aprobadas  = solicitudes.filter(s => s.estado === "aprobada");
  const rechazadas = solicitudes.filter(s => s.estado === "rechazada");
  const tabData    = { pendiente: pendientes, aprobada: aprobadas, rechazada: rechazadas };

  const current = (tabData[tab] || []).filter(s =>
    !search ||
    s.usuario?.username?.toLowerCase().includes(search.toLowerCase()) ||
    s.usuario?.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.rolSolicitado?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .p * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

        .p {
          min-height: 100vh;
          background: #EEF0F5;
          padding: 2.25rem 2.5rem;
        }

        /* ── Header ── */
        .p-header {
          margin-bottom: 2rem;
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }
        .p-title-group {}
        .p-eyebrow {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: #8B93A7; margin: 0 0 6px;
        }
        .p-title {
          font-size: 1.625rem; font-weight: 700; color: #1A1F2E;
          letter-spacing: -0.4px; margin: 0;
        }
        .p-header-right { display: flex; gap: 10px; align-items: center; }

        .p-search {
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #DDE1EA;
          border-radius: 10px; padding: 8px 14px;
          transition: border-color 0.15s;
        }
        .p-search:focus-within { border-color: #6366F1; }
        .p-search input {
          border: none; outline: none; font-size: 0.82rem; color: #1A1F2E;
          font-family: inherit; width: 200px; background: transparent;
        }
        .p-search input::placeholder { color: #B0B8CB; }

        .p-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 10px; border: 1px solid #DDE1EA;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          transition: all 0.15s; font-family: inherit; background: #fff; color: #3D4558;
        }
        .p-btn:hover { background: #F4F5F8; border-color: #C5CAD6; }

        /* ── Stats row ── */
        .p-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-bottom: 1.75rem; }

        .p-stat {
          background: #fff; border-radius: 14px; padding: 1.25rem 1.5rem;
          border: 1px solid #E4E7EF; cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; justify-content: space-between;
        }
        .p-stat:hover { border-color: #C5CAD6; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .p-stat.p-active-pend  { border-color: #F59E0B; background: #FFFDF5; box-shadow: 0 2px 10px rgba(245,158,11,0.1); }
        .p-stat.p-active-aprob { border-color: #22C55E; background: #F8FFF9; box-shadow: 0 2px 10px rgba(34,197,94,0.1); }
        .p-stat.p-active-rech  { border-color: #EF4444; background: #FFF8F8; box-shadow: 0 2px 10px rgba(239,68,68,0.1); }

        .p-stat-num   { font-size: 2rem; font-weight: 700; letter-spacing: -1px; line-height: 1; }
        .p-stat-label { font-size: 0.75rem; font-weight: 600; color: #8B93A7; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 5px; }
        .p-stat-pill  {
          font-size: 0.72rem; font-weight: 700; padding: 4px 10px;
          border-radius: 999px; letter-spacing: 0.3px;
        }

        /* ── Alert ── */
        .p-alert {
          display: flex; align-items: center; gap: 10px;
          padding: 0.8rem 1.1rem; margin-bottom: 1.25rem;
          border-radius: 10px; font-size: 0.85rem; font-weight: 500;
          border-left: 3px solid;
        }
        .p-alert.success { background: #F0FDF4; color: #166534; border-color: #22C55E; }
        .p-alert.error   { background: #FEF2F2; color: #991B1B; border-color: #EF4444; }

        /* ── Tabs ── */
        .p-tabs {
          display: flex; gap: 0; margin-bottom: 1.25rem;
          border-bottom: 1.5px solid #E4E7EF;
        }
        .p-tab {
          padding: 10px 20px; border: none; background: transparent;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          color: #8B93A7; font-family: inherit;
          border-bottom: 2px solid transparent; margin-bottom: -1.5px;
          transition: color 0.15s, border-color 0.15s;
          display: flex; align-items: center; gap: 7px;
        }
        .p-tab:hover { color: #3D4558; }
        .p-tab.p-tab-pend  { color: #92400E; border-bottom-color: #F59E0B; }
        .p-tab.p-tab-aprob { color: #14532D; border-bottom-color: #22C55E; }
        .p-tab.p-tab-rech  { color: #7F1D1D; border-bottom-color: #EF4444; }
        .p-tab-n {
          min-width: 20px; height: 18px; padding: 0 5px;
          border-radius: 5px; font-size: 0.68rem; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
          background: #F1F3F7; color: #8B93A7;
        }
        .p-tab.p-tab-pend  .p-tab-n { background: #FEF3C7; color: #92400E; }
        .p-tab.p-tab-aprob .p-tab-n { background: #DCFCE7; color: #14532D; }
        .p-tab.p-tab-rech  .p-tab-n { background: #FEE2E2; color: #7F1D1D; }

        /* ── Table card ── */
        .p-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #E4E7EF; overflow: hidden;
        }

        .p-table { width: 100%; border-collapse: collapse; }
        .p-table thead tr { border-bottom: 1px solid #F1F3F7; }
        .p-table th {
          padding: 0.8rem 1.25rem; font-size: 0.68rem; font-weight: 700;
          color: #B0B8CB; text-transform: uppercase; letter-spacing: 1px;
          text-align: left; background: #FAFBFD;
        }
        .p-table tbody tr { border-bottom: 1px solid #F7F8FB; transition: background 0.1s; }
        .p-table tbody tr:hover { background: #FAFBFD; }
        .p-table tbody tr:last-child { border-bottom: none; }
        .p-table td { padding: 0.95rem 1.25rem; font-size: 0.855rem; color: #3D4558; vertical-align: middle; }

        /* ── User cell ── */
        .p-user { display: flex; align-items: center; gap: 11px; }
        .p-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          color: #fff; font-weight: 700; font-size: 0.82rem;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .p-uname { font-weight: 600; color: #1A1F2E; font-size: 0.855rem; }
        .p-uemail { font-size: 0.74rem; color: #9BA4B6; margin-top: 2px; }

        /* ── Rol tag ── */
        .p-rol {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 6px;
          font-size: 0.75rem; font-weight: 600;
        }
        .p-rol-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* ── Estado tag ── */
        .p-estado {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 6px;
          font-size: 0.75rem; font-weight: 600;
        }

        /* ── Date ── */
        .p-date { font-size: 0.78rem; color: #B0B8CB; }

        /* ── Action buttons ── */
        .p-actions { display: flex; gap: 7px; }
        .p-btn-ok, .p-btn-no {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 13px; border-radius: 7px;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 0.15s; font-family: inherit; border: 1px solid;
        }
        .p-btn-ok { background: #F0FDF4; color: #15803D; border-color: #BBF7D0; }
        .p-btn-ok:hover:not(:disabled) { background: #16A34A; color: #fff; border-color: #16A34A; }
        .p-btn-no { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
        .p-btn-no:hover:not(:disabled) { background: #DC2626; color: #fff; border-color: #DC2626; }
        .p-btn-ok:disabled, .p-btn-no:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Empty ── */
        .p-empty { padding: 3.5rem 2rem; text-align: center; }
        .p-empty-icon  { font-size: 2.25rem; margin-bottom: 10px; opacity: 0.5; }
        .p-empty-title { font-size: 0.95rem; font-weight: 600; color: #3D4558; margin-bottom: 4px; }
        .p-empty-sub   { font-size: 0.8rem; color: #9BA4B6; }

        /* ── Loading ── */
        .p-loading { padding: 3rem 2rem; text-align: center; }
        .p-spinner {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid #E4E7EF; border-top-color: #6366F1;
          animation: pSpin 0.7s linear infinite; margin: 0 auto 10px;
        }
        @keyframes pSpin { to { transform: rotate(360deg); } }
        .p-loading-txt { font-size: 0.82rem; color: #9BA4B6; }

        /* ── Footer ── */
        .p-footer {
          padding: 0.7rem 1.25rem; border-top: 1px solid #F1F3F7;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.74rem; color: #B0B8CB;
        }

        @media (max-width: 768px) {
          .p { padding: 1rem; }
          .p-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="p">

        {/* Header */}
        <div className="p-header">
          <div className="p-title-group">
            <p className="p-eyebrow">Panel de administración</p>
            <h1 className="p-title">Solicitudes de Roles</h1>
          </div>
          <div className="p-header-right">
            <div className="p-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0B8CB" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input placeholder="Buscar usuario, email o rol..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="p-btn" onClick={cargarSolicitudes}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
              Actualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-stats">
          <div className={`p-stat ${tab==="pendiente"?"p-active-pend":""}`} onClick={() => setTab("pendiente")}>
            <div>
              <div className="p-stat-num" style={{ color: "#D97706" }}>{pendientes.length}</div>
              <div className="p-stat-label">Pendientes</div>
            </div>
            <span className="p-stat-pill" style={{ background:"#FEF3C7", color:"#92400E" }}>Por revisar</span>
          </div>
          <div className={`p-stat ${tab==="aprobada"?"p-active-aprob":""}`} onClick={() => setTab("aprobada")}>
            <div>
              <div className="p-stat-num" style={{ color:"#16A34A" }}>{aprobadas.length}</div>
              <div className="p-stat-label">Aprobadas</div>
            </div>
            <span className="p-stat-pill" style={{ background:"#DCFCE7", color:"#14532D" }}>Aprobadas</span>
          </div>
          <div className={`p-stat ${tab==="rechazada"?"p-active-rech":""}`} onClick={() => setTab("rechazada")}>
            <div>
              <div className="p-stat-num" style={{ color:"#DC2626" }}>{rechazadas.length}</div>
              <div className="p-stat-label">Rechazadas</div>
            </div>
            <span className="p-stat-pill" style={{ background:"#FEE2E2", color:"#7F1D1D" }}>Rechazadas</span>
          </div>
        </div>

        {/* Alert */}
        {msg && (
          <div className={`p-alert ${msg.type}`}>
            {msg.type === "success" ? "✓" : "!"} {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="p-tabs">
          {[
            { key:"pendiente", label:"Pendientes", active:"p-tab-pend",  count:pendientes.length },
            { key:"aprobada",  label:"Aprobadas",  active:"p-tab-aprob", count:aprobadas.length  },
            { key:"rechazada", label:"Rechazadas", active:"p-tab-rech",  count:rechazadas.length },
          ].map(t => (
            <button key={t.key} className={`p-tab ${tab===t.key ? t.active : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
              <span className="p-tab-n">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="p-card">
          {loading ? (
            <div className="p-loading">
              <div className="p-spinner" />
              <div className="p-loading-txt">Cargando registros...</div>
            </div>
          ) : current.length === 0 ? (
            <div className="p-empty">
              <div className="p-empty-icon">{search ? "🔍" : "📂"}</div>
              <div className="p-empty-title">{search ? "Sin resultados" : "No hay registros"}</div>
              <div className="p-empty-sub">{search ? `No se encontró "${search}"` : `No hay solicitudes ${tab === "pendiente" ? "pendientes" : tab + "s"} aún.`}</div>
            </div>
          ) : (
            <>
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol solicitado</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    {tab === "pendiente" && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {current.map((s) => {
                    const rc  = rolConfig(s.rolSolicitado?.nombre);
                    const ac  = avatarColor(s.rolSolicitado?.nombre);
                    const ini = (s.usuario?.username || "?")[0].toUpperCase();
                    return (
                      <tr key={s._id}>
                        <td>
                          <div className="p-user">
                            <div className="p-avatar" style={{ background: ac }}>{ini}</div>
                            <div>
                              <div className="p-uname">{s.usuario?.username || "—"}</div>
                              <div className="p-uemail">{s.usuario?.email || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="p-rol" style={{ background: rc.bg, color: rc.color }}>
                            <span className="p-rol-dot" style={{ background: rc.dot }} />
                            {s.rolSolicitado?.nombre || "—"}
                          </span>
                        </td>
                        <td>
                          {s.estado === "pendiente" && <span className="p-estado" style={{ background:"#FFFBEB", color:"#92400E" }}>Pendiente</span>}
                          {s.estado === "aprobada"  && <span className="p-estado" style={{ background:"#F0FDF4", color:"#15803D" }}>Aprobada</span>}
                          {s.estado === "rechazada" && <span className="p-estado" style={{ background:"#FEF2F2", color:"#991B1B" }}>Rechazada</span>}
                        </td>
                        <td><span className="p-date">{formatDate(s.createdAt)}</span></td>
                        {tab === "pendiente" && (
                          <td>
                            <div className="p-actions">
                              <button className="p-btn-ok" disabled={!!procesando} onClick={() => accion(s._id, "aprobar")}>
                                {procesando === s._id + "aprobar" ? "..." : "✓ Aprobar"}
                              </button>
                              <button className="p-btn-no" disabled={!!procesando} onClick={() => accion(s._id, "rechazar")}>
                                {procesando === s._id + "rechazar" ? "..." : "✗ Rechazar"}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-footer">
                <span>{current.length} de {tabData[tab]?.length} registros{search ? ` · filtrado por "${search}"` : ""}</span>
                <span>{solicitudes.length} solicitudes en total</span>
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
};

export default SolicitudesAdmin;