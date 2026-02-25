import SolicitudRol from "../models/solicitud/SolicitudRol.js";
import Usuario from "../models/usuarios/Usuario.js";

/**
 *  Ver solicitudes pendientes
 */
const listarSolicitudesPendientes = async (req, res) => {
  const { estado } = req.query;
  
  const filtro = estado ? { estado } : {}; // si viene ?estado=pendiente filtra, si no trae todas
  
  const solicitudes = await SolicitudRol.find(filtro)
    .populate("usuario", "username email")
    .populate("rolSolicitado", "nombre")
    .sort({ createdAt: -1 });

  res.json(solicitudes);
};

/**
 *  Aprobar solicitud
 */
const aprobarSolicitud = async (req, res) => {
  const { id } = req.params;

  const solicitud = await SolicitudRol.findById(id)
    .populate("usuario")
    .populate("rolSolicitado");

  if (!solicitud) {
    return res.status(404).json({ msg: "Solicitud no encontrada" });
  }

  if (solicitud.estado !== "pendiente") {
    return res.status(400).json({ msg: "Solicitud ya fue procesada" });
  }

  // 🔄 Actualizar solicitud
  solicitud.estado = "aprobada";
  solicitud.revisadoPor = req.usuario._id;
  solicitud.fechaRevision = Date.now();
  await solicitud.save();

  //  Actualizar usuario
  const usuario = await Usuario.findById(solicitud.usuario._id);
  usuario.rol = solicitud.rolSolicitado._id;
  usuario.estado = "activo";
  await usuario.save();

  res.json({ msg: "Solicitud aprobada correctamente" });
};

/**
 *  Rechazar solicitud
 */
const rechazarSolicitud = async (req, res) => {
  const { id } = req.params;

  const solicitud = await SolicitudRol.findById(id);

  if (!solicitud) {
    return res.status(404).json({ msg: "Solicitud no encontrada" });
  }

  if (solicitud.estado !== "pendiente") {
    return res.status(400).json({ msg: "Solicitud ya fue procesada" });
  }

  solicitud.estado = "rechazada";
  solicitud.revisadoPor = req.usuario._id;
  solicitud.fechaRevision = Date.now();

  await solicitud.save();

  res.json({ msg: "Solicitud rechazada" });
};

export {
  listarSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
};
