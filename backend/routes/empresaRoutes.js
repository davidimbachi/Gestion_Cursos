import express from "express";
import EmpresaSolicitante from "../models/ofertas/oferta/EmpresaSolicitante.js";

const router = express.Router();

// GET /api/empresas?tipo=REGULAR  o  ?tipo=CAMPESENA
router.get("/", async (req, res) => {
  try {
    const filtro = {};
    if (req.query.tipo)  filtro.tipo   = req.query.tipo;
    if (req.query.q)     filtro.nombre = { $regex: req.query.q, $options: "i" };

    const empresas = await EmpresaSolicitante.find(filtro).sort({ nombre: 1 });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar empresas", error: error.message });
  }
});

// POST /api/empresas
router.post("/", async (req, res) => {
  try {
    const empresa = new EmpresaSolicitante(req.body);
    await empresa.save();
    res.status(201).json(empresa);
  } catch (error) {
    res.status(400).json({ msg: "Error al crear empresa", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filtro = {};
    if (req.query.tipo) filtro.tipo   = req.query.tipo;
    if (req.query.q)    filtro.nombre = { $regex: req.query.q, $options: "i" };

    const empresas = await EmpresaOferta.find(filtro).sort({ nombre: 1 });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar empresas", error: error.message });
  }
});

export default router;