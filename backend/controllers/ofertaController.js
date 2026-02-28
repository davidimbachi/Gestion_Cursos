import Oferta from "../models/ofertas/oferta/oferta.js";
import Solicitud from "../models/solicitud/Solicitud.js";
import { v4 as uuidv4 } from "uuid";


// Crear nueva oferta
const crearOferta = async (req, res) => {
  try {
    const datos = req.body;

    datos.usuario = req.usuarioId;
    // Generar un token único automáticamente
    datos.token_inscripcion = uuidv4();

    const nuevaOferta = new Oferta(datos);
    console.log("ANTES DE GUARDAR:", datos);

    await nuevaOferta.save();

    res.json(nuevaOferta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear la oferta", error });
  }
};


// Listar ofertas ----------------------------------
const listarOfertas = async (req, res) => {
  try {
    // ✅ Verificar que haya un usuario autenticado
    if (!req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // ✅ Filtrar: SOLO ofertas del usuario actual que NO han sido enviadas
    const ofertas = await Oferta.find({ 
      usuario: req.usuario._id,
      estado_enviada: false  // ← CAMBIO CLAVE: Solo ofertas NO enviadas
    })
      .populate("usuario", "nombre email username")
      .populate({
        path: "programa",
        select: "codigo nombre version duracion",
        populate: [
          { path: "nivel_formacion", select: "nombre" },
          { path: "linea_tecnologica", select: "nombre" },
          { path: "red_conocimiento", select: "nombre" }
        ]
      })
      .populate({
        path: "lugar",
        select: "ambiente direccion",
        populate: [
          { path: "departamento", select: "nombre", model: "Departamento" },
          { path: "municipio", select: "nombre", model: "Municipio" },
          { path: "corregimiento", select: "nombre", model: "Corregimiento" }
        ]
      })
      .populate("empresa_solicitante", "nombre nit ciudad")
      .populate("programa_especial", "nombre")
      .sort({ createdAt: -1 });
    
    console.log(`📊 Ofertas de ${req.usuario.username}: ${ofertas.length} encontradas`);
    
    res.json(ofertas);
  } catch (error) {
    console.error('❌ ERROR en listarOfertas:', error.message);
    res.status(500).json({ 
      msg: "Error al listar las ofertas", 
      error: error.message 
    });
  }
};


const enviarOferta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const oferta = await Oferta.findById(id);
    if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" });
    
    if (oferta.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ msg: "No tienes permiso para enviar esta oferta" });
    }
    
    if (oferta.estado_enviada) {
      return res.status(400).json({ msg: "Esta oferta ya fue enviada" });
    }
    
    // ✅ Actualizar estado de la oferta
    oferta.estado_enviada = true;
    await oferta.save();
    
    // ✅ Crear solicitud CON LOS CAMPOS CORRECTOS del modelo
    const nuevaSolicitud = new Solicitud({
      oferta: oferta._id,
      solicitante: req.usuario._id,  // ✅ Campo correcto
      coordinador: req.usuario.coordinadorAsignado || null,
      estado: 'revision',
      fechaUltimoCambio: Date.now(),
      usuarioUltimoCambio: req.usuario._id
    });
    
    await nuevaSolicitud.save();
    
    // ✅ Poblar para devolver datos útiles al frontend
    await nuevaSolicitud.populate({
      path: 'oferta',
      populate: [
        { path: 'programa', select: 'nombre codigo' },
        { path: 'solicitante', select: 'nombre email username' }
      ]
    });
    
    res.json({ 
      msg: "✅ Oferta enviada a revisión", 
      oferta,
      solicitud: nuevaSolicitud 
    });
    
  } catch (error) {
    console.error('❌ ERROR en enviarOferta:', error.message);
    res.status(500).json({ msg: "Error al enviar la oferta", error: error.message });
  }
};


// Actualiza oferta -----------------------------------
export const actualizarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id).populate('programa');
    
    if (!oferta) {
      return res.status(404).json({ msg: "Oferta no encontrada" });
    }

    const camposActualizables = {
      codigo_ficha: req.body.codigo_ficha,
      cupo: req.body.cupo,
      fecha_inicio: req.body.fecha_inicio,
      fecha_inscripcion: req.body.fecha_inscripcion,
      fecha_terminacion: req.body.fecha_terminacion,
      modalidad_oferta: req.body.modalidad_oferta,
      tipo_oferta: req.body.tipo_oferta,
      estado_enviada: req.body.estado_enviada,
    };

    // Solo actualizar si el campo existe en req.body
    Object.keys(camposActualizables).forEach(key => {
      if (camposActualizables[key] !== undefined) {
        oferta[key] = camposActualizables[key];
      }
    });
    
    const ofertaActualizada = await oferta.save();
    await ofertaActualizada.populate('programa');
    res.json(ofertaActualizada);
    
  } catch (error) {
    console.error('Error en actualizarOferta:', error);
    res.status(500).json({ msg: "Error al actualizar la oferta", error });
  }
};


// ✅ EXPORTACIONES
export { crearOferta, listarOfertas, enviarOferta };