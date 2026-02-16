import Oferta from "../models/ofertas/oferta/oferta.js";

// Crear nueva oferta
const crearOferta = async (req, res) => {
  try {
    const oferta = new Oferta(req.body);
    oferta.usuario = req.usuario._id; // usuario autenticado
    const ofertaGuardada = await oferta.save();
    res.json(ofertaGuardada);
  } catch (error) {
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
