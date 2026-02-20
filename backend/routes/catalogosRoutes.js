import express from "express";
import ModalidadPrograma from "../models/ofertas/oferta/ModalidadPrograma.js";
import ProgramaEspecial from "../models/ofertas/oferta/ProgramaEspecial.js";

const router = express.Router();

// GET /api/catalogos/modalidades
router.get("/modalidades", async (req, res) => {
  try {
    const modalidades = await ModalidadPrograma.find().sort({ nombre: 1 });
    res.json(modalidades);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar modalidades", error: error.message });
  }
});

// GET /api/catalogos/programas-especiales
router.get("/programas-especiales", async (req, res) => {
  try {
    const programas = await ProgramaEspecial.find().sort({ nombre: 1 });
    res.json(programas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar programas especiales", error: error.message });
  }
});

export default router;
