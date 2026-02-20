import express from "express";
import ProgramaEspecial from "../models/ofertas/oferta/ProgramaEspecial.js";

const router = express.Router();


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
