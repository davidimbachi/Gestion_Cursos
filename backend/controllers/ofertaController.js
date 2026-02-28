import Oferta from "../models/ofertas/oferta/oferta.js";
import EmpresaSolicitante from "../models/ofertas/oferta/EmpresaSolicitante.js"; // ← AGREGAR
import { v4 as uuidv4 } from "uuid";


// Crear nueva oferta
const crearOferta = async (req, res) => {
  try {
    const datos = req.body;
    datos.token_inscripcion = uuidv4();

    // Si viene info de empresa REGULAR, crearla o actualizarla
    if (datos.modalidad_oferta === 'REGULAR' && datos.info_empresa_regular) {
      const infoEmp = datos.info_empresa_regular;

      // Buscar si ya existe por NIT, si no crear nueva
      let empresa = null;
      if (infoEmp.nit_empresa) {
        empresa = await EmpresaSolicitante.findOneAndUpdate(
          { nit: infoEmp.nit_empresa },
          {
            nit:                        infoEmp.nit_empresa,
            nombre:                     infoEmp.nombre_empresa,
            cual_convenio:              infoEmp.cual_convenio,
            fecha_creacion:             infoEmp.fecha_creacion,
            tipo_empresa:               infoEmp.tipo_empresa,      // ObjectId del catálogo
            direccion:                  infoEmp.direccion_empresa,
            nombre_representante_legal: infoEmp.nombre_representante_legal,
            nombre_contacto:            infoEmp.nombre_contacto,
            celular_contacto:           infoEmp.celular_contacto,
            correo_contacto:            infoEmp.correo_contacto,
            numero_empleados:           infoEmp.numero_empleados,
          },
            { upsert: true, new: true }
        );
      } else {
        empresa = await EmpresaSolicitante.create({
          nombre:                    infoEmp.nombre_empresa,
          hace_parte_convenio:       infoEmp.hace_parte_convenio,
          cual_convenio:             infoEmp.cual_convenio,
          fecha_creacion:            infoEmp.fecha_creacion,
          tipo_empresa:              infoEmp.tipo_empresa,
          direccion_empresa:         infoEmp.direccion_empresa,
          nombre_representante_legal:infoEmp.nombre_representante_legal,
          nombre_contacto:           infoEmp.nombre_contacto,
          celular_contacto:          infoEmp.celular_contacto,
          correo_contacto:           infoEmp.correo_contacto,
          numero_empleados:          infoEmp.numero_empleados,
        });
      }

      datos.empresa_solicitante = empresa._id;
      delete datos.info_empresa_regular; // limpiar antes de guardar oferta
    }

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
