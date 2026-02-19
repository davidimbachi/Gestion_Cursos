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

// Listar todas las ofertas
const listarOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.find()
      .populate("usuario", "nombre email") // traer info del usuario
      .populate("programa")
      .populate("modalidad_programa")
      .populate("lugar");
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar las ofertas", error });
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
