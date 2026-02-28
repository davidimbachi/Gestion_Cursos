import SolicitudRol from "../models/solicitud/SolicitudRol.js";
import Solicitud from "../models/solicitud/Solicitud.js";
import Oferta from "../models/ofertas/oferta/oferta.js";
import Usuario from "../models/usuarios/Usuario.js";

/**
 * ==========================================
 *  SOLICITUDES DE ROL (Admin)
 * ==========================================
 */

/**
 *  Ver solicitudes pendientes de rol
 */
const listarSolicitudesPendientes = async (req, res) => {
  const { estado } = req.query;
  
  const filtro = estado ? { estado } : {};
  
  const solicitudes = await SolicitudRol.find(filtro)
    .populate("usuario", "username email")
    .populate("rolSolicitado", "nombre")
    .sort({ createdAt: -1 });

  res.json(solicitudes);
};

/**
 *  Aprobar solicitud de rol
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

  solicitud.estado = "aprobada";
  solicitud.revisadoPor = req.usuario._id;
  solicitud.fechaRevision = Date.now();
  await solicitud.save();

  const usuario = await Usuario.findById(solicitud.usuario._id);
  usuario.rol = solicitud.rolSolicitado._id;
  usuario.estado = "activo";
  await usuario.save();

  res.json({ msg: "Solicitud aprobada correctamente" });
};

/**
 *  Rechazar solicitud de rol
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

/**
 * ==========================================
 *  SOLICITUDES DE OFERTAS (Instructor/Coordinador)
 * ==========================================
 */

/**
 * 👨‍🏫 Instructor: Listar SUS solicitudes (ofertas enviadas)
 */
const listarMisSolicitudesOfertas = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({ solicitante: req.usuario._id })
      .populate({
        path: 'oferta',
        populate: [
          { path: 'programa', select: 'nombre codigo version' },
          { path: 'lugar', select: 'ambiente direccion' },
          { path: 'usuario', select: 'nombre email username' }
        ]
      })
      .populate('coordinador', 'nombre email')
      .sort({ createdAt: -1 });
    
    res.json(solicitudes);
  } catch (error) {
    console.error('❌ Error en listarMisSolicitudesOfertas:', error);
    res.status(500).json({ 
      msg: "Error al listar solicitudes", 
      error: error.message 
    });
  }
};

/**
 * 👨‍💼 Coordinador: Listar TODAS las solicitudes de ofertas
 */
const listarSolicitudesOfertasCoordinador = async (req, res) => {
  try {
    const { estado } = req.query;
    const filtro = estado ? { estado } : { estado: { $in: ['revision', 'pendiente'] } };
    
    const solicitudes = await Solicitud.find(filtro)
      .populate({
        path: 'oferta',
        populate: [
          { path: 'programa', select: 'nombre codigo version' },
          { path: 'usuario', select: 'nombre email username' },
          { path: 'lugar', select: 'ambiente direccion' }
        ]
      })
      .populate('solicitante', 'nombre email username')
      .populate('coordinador', 'nombre email')
      .sort({ createdAt: -1 });
    
    res.json(solicitudes);
  } catch (error) {
    console.error('❌ Error en listarSolicitudesOfertasCoordinador:', error);
    res.status(500).json({ 
      msg: "Error al listar solicitudes", 
      error: error.message 
    });
  }
};

/**
 * 👨‍💼 Coordinador: Aprobar solicitud de oferta
 */
const aprobarSolicitudOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findById(id).populate('oferta');
    
    if (!solicitud) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }
    
    if (solicitud.estado !== 'revision' && solicitud.estado !== 'pendiente') {
      return res.status(400).json({ msg: "Solicitud ya fue procesada" });
    }
    
    solicitud.estado = 'aprobada';
    solicitud.fechaRevision = Date.now();
    solicitud.usuarioUltimoCambio = req.usuario._id;
    await solicitud.save();
    
    await solicitud.populate({
      path: 'oferta',
      populate: [
        { path: 'programa', select: 'nombre codigo' },
        { path: 'solicitante', select: 'nombre email' }
      ]
    });
    
    res.json({ 
      msg: "✅ Solicitud aprobada correctamente", 
      solicitud 
    });
  } catch (error) {
    console.error('❌ Error en aprobarSolicitudOferta:', error);
    res.status(500).json({ 
      msg: "Error al aprobar solicitud", 
      error: error.message 
    });
  }
};

/**
 * 👨‍💼 Coordinador: Rechazar solicitud de oferta
 */
const rechazarSolicitudOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const solicitud = await Solicitud.findById(id);
    
    if (!solicitud) {
      return res.status(404).json({ msg: "Solicitud no encontrada" });
    }
    
    if (solicitud.estado !== 'revision' && solicitud.estado !== 'pendiente') {
      return res.status(400).json({ msg: "Solicitud ya fue procesada" });
    }
    
    solicitud.estado = 'rechazada';
    solicitud.fechaRevision = Date.now();
    solicitud.usuarioUltimoCambio = req.usuario._id;
    
    if (motivo) {
      solicitud.motivoRechazo = motivo;
    }
    
    await solicitud.save();
    
    res.json({ 
      msg: "❌ Solicitud rechazada", 
      solicitud 
    });
  } catch (error) {
    console.error('❌ Error en rechazarSolicitudOferta:', error);
    res.status(500).json({ 
      msg: "Error al rechazar solicitud", 
      error: error.message 
    });
  }
};

/**
 * ==========================================
 *  EXPORTACIONES (ÚNICO BLOQUE AL FINAL)
 * ==========================================
 */
export {
  // Solicitudes de Rol (Admin)
  listarSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
  
  // Solicitudes de Ofertas (Instructor/Coordinador)
  listarMisSolicitudesOfertas,
  listarSolicitudesOfertasCoordinador,
  aprobarSolicitudOferta,
  rechazarSolicitudOferta
};