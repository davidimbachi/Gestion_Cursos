import express from "express";
import ProgramaEspecial from "../models/ofertas/oferta/ProgramaEspecial.js";
import TipoOferta from "../models/ofertas/oferta/TipoOferta.js";
import ModalidadOferta from "../models/ofertas/oferta/ModalidadOferta.js";

const router = express.Router();

router.get("/programas-especiales", async (req, res) => {
  try {
    const programas = await ProgramaEspecial.find().sort({ nombre: 1 });
    res.json(programas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar programas especiales", error: error.message });
  }
});

router.get("/tipos-oferta", async (req, res) => {
  try {
    const tipos = await TipoOferta.find().sort({ nombre: 1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar tipos de oferta", error: error.message });
  }
});

router.get("/modalidades-oferta", async (req, res) => {
  try {
    const modalidades = await ModalidadOferta.find().sort({ nombre: 1 });
    res.json(modalidades);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar modalidades", error: error.message });
  }
});

export default router;