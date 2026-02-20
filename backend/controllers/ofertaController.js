import Oferta from "../models/ofertas/oferta/oferta.js";
import { v4 as uuidv4 } from "uuid";


// Crear nueva oferta
const crearOferta = async (req, res) => {
  try {
    const datos = req.body;

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


// Listar ofertas-----
const listarOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.find()
      // Usuario
      .populate("usuario", "nombre email username")  
      
      // Programa con sus referencias
      .populate({
        path: "programa",
        select: "codigo nombre version duracion",
        populate: [
          { path: "nivel_formacion", select: "nombre" },
          { path: "linea_tecnologica", select: "nombre" },
          { path: "red_conocimiento", select: "nombre" }
        ]
      })

      // Modalidad del programa
      .populate("modalidad_programa", "nombre")
      
      // LUGAR - Con departamento, municipio y corregimiento (UNIFICADO)
      .populate({
        path: "lugar",
        select: "ambiente direccion",
        populate: [
          { 
            path: "departamento", 
            select: "nombre",
            model: "Departamento"
          },
          { 
            path: "municipio", 
            select: "nombre",
            model: "Municipio"
          },
          { 
            path: "corregimiento", 
            select: "nombre",
            model: "Corregimiento"
          }
        ]
      })
      
      // Empresa solicitante
      .populate("empresa_solicitante", "nombre nit ciudad")
      
      // Programa especial
      .populate("programa_especial", "nombre");
    
    // Log para verificar que los datos llegan bien
    console.log('📍 Ubicación (ejemplo):', JSON.stringify(ofertas[0]?.lugar, null, 2));
    
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ 
      msg: "Error al listar las ofertas", 
      error: error.message 
    });
  }
};

// Actualizar oferta
const actualizarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) {
      return res.status(404).json({ msg: "Oferta no encontrada" });
    }

    // Actualizar con los datos enviados
    Object.assign(oferta, req.body);
    const ofertaActualizada = await oferta.save();
    res.json(ofertaActualizada);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la oferta", error });
  }
};

export { crearOferta, listarOfertas, actualizarOferta };
