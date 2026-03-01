import Oferta from "../models/ofertas/oferta/oferta.js";
import EmpresaSolicitante from "../models/ofertas/oferta/EmpresaSolicitante.js"; // ← AGREGAR
import { v4 as uuidv4 } from "uuid";


// Crear nueva oferta
const crearOferta = async (req, res) => {
  try {
    const datos = req.body;
    datos.token_inscripcion = uuidv4();

    // ── REGULAR ────────────────────────────────────
    if (datos.modalidad_oferta === 'REGULAR' && datos.info_empresa_regular) {
      const info = datos.info_empresa_regular;
      const camposRegular = {
        tipo:                       'REGULAR',
        nombre:                     info.nombre_empresa,
        nit:                        info.nit_empresa,
        cual_convenio:              info.cual_convenio,
        fecha_creacion:             info.fecha_creacion,
        tipo_empresa:               info.tipo_empresa,
        direccion:                  info.direccion_empresa,
        nombre_representante_legal: info.nombre_representante_legal,
        nombre_contacto:            info.nombre_contacto,
        celular_contacto:           info.celular_contacto,
        correo_contacto:            info.correo_contacto,
        numero_empleados:           info.numero_empleados,
      };

      let empresa = null;
      if (info.nit_empresa) {
        // Si tiene NIT: buscar y actualizar, si no existe crear
        empresa = await EmpresaOferta.findOneAndUpdate(
          { nit: info.nit_empresa, tipo: 'REGULAR' },
          camposRegular,
          { upsert: true, new: true }
        );
      } else {
        empresa = await EmpresaOferta.create(camposRegular);
      }

      datos.empresa_solicitante = empresa._id;
      delete datos.info_empresa_regular;
    }

    // ── CAMPESENA ──────────────────────────────────
    if (datos.modalidad_oferta === 'CAMPESENA' && datos.info_empresa_campesena) {
      const info = datos.info_empresa_campesena;
      const camposCampesena = {
        tipo:    'CAMPESENA',
        nombre:  info.nombre_empresa,
        nit:     info.nit_empresa,
        direccion:        info.direccion_empresa,
        nombre_contacto:  info.nombre_contacto,
        celular_contacto: info.celular_contacto,
        correo_contacto:  info.correo_contacto,

        // Datos empresa CAMPESENA
        fecha_creacion_campesena:             info.fecha_creacion,
        tipo_empresa_campesena:               info.tipo_empresa,
        nombre_representante_legal_campesena: info.nombre_representante_legal,
        numero_empleados_campesena:           info.numero_empleados,

        // Instructores
        inst_tecnico_nombre:  info.inst_tecnico_nombre,
        inst_tecnico_correo:  info.inst_tecnico_correo,
        inst_tecnico_celular: info.inst_tecnico_celular,
        inst_tecnico_mes1:    info.inst_tecnico_mes1,
        inst_tecnico_mes2:    info.inst_tecnico_mes2,
        inst_tecnico_mes3:    info.inst_tecnico_mes3,
        inst_tecnico_mes4:    info.inst_tecnico_mes4,
        inst_tecnico_mes5:    info.inst_tecnico_mes5,

        inst_empresarial_nombre:  info.inst_empresarial_nombre,
        inst_empresarial_correo:  info.inst_empresarial_correo,
        inst_empresarial_celular: info.inst_empresarial_celular,
        inst_empresarial_mes1:    info.inst_empresarial_mes1,
        inst_empresarial_mes2:    info.inst_empresarial_mes2,
        inst_empresarial_mes3:    info.inst_empresarial_mes3,
        inst_empresarial_mes4:    info.inst_empresarial_mes4,
        inst_empresarial_mes5:    info.inst_empresarial_mes5,

        inst_fullpopular_nombre:  info.inst_fullpopular_nombre,
        inst_fullpopular_correo:  info.inst_fullpopular_correo,
        inst_fullpopular_celular: info.inst_fullpopular_celular,
        inst_fullpopular_mes1:    info.inst_fullpopular_mes1,
        inst_fullpopular_mes2:    info.inst_fullpopular_mes2,
      };

      let empresa = null;
      if (info.nit_empresa) {
        empresa = await EmpresaOferta.findOneAndUpdate(
          { nit: info.nit_empresa, tipo: 'CAMPESENA' },
          camposCampesena,
          { upsert: true, new: true }
        );
      } else {
        empresa = await EmpresaOferta.create(camposCampesena);
      }

      datos.empresa_solicitante = empresa._id;
      delete datos.info_empresa_campesena;
    }
    datos.usuario = req.usuario._id;
    const nuevaOferta = new Oferta(datos);
    await nuevaOferta.save();
    res.json(nuevaOferta);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear la oferta", error });
  }
};


// Listar ofertas-----
const listarOfertas = async (req, res) => {
  try {
    // ✅ Verificar que haya un usuario autenticado
    if (!req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // ✅ Filtrar: SOLO ofertas del usuario actual
    const ofertas = await Oferta.find({ usuario: req.usuario._id })
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
      .populate("modalidad_programa", "nombre")
      .populate("sector", "codigo nombre")          // ← NUEVO
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
    
    console.log(`📊 Ofertas de ${req.usuario.nombre}: ${ofertas.length} encontradas`);
    
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ 
      msg: "Error al listar las ofertas", 
      error: error.message 
    });
  }
};

// actilaiza oferta
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

export { crearOferta, listarOfertas };
