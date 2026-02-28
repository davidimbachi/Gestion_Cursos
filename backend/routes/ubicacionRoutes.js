import express from "express";
import Departamento from "../models/ofertas/ubicacion/Departamento.js";
import Municipio from "../models/ofertas/ubicacion/Municipio.js";
import Corregimiento from "../models/ofertas/ubicacion/Corregimiento.js"; // 👈 importar
import Lugar from "../models/ofertas/ubicacion/Lugar.js";

const router = express.Router();

// ── DEPARTAMENTOS ─────────────────────────────────────────────────────────────
// GET /api/ubicacion/departamentos
router.get("/departamentos", async (req, res) => {
  try {
    const departamentos = await Departamento.find().sort({ nombre: 1 });
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar departamentos", error: error.message });
  }
});

// ── MUNICIPIOS ────────────────────────────────────────────────────────────────
// GET /api/ubicacion/municipios?departamento=ID
router.get("/municipios", async (req, res) => {
  try {
    const filtro = req.query.departamento ? { departamento: req.query.departamento } : {};
    const municipios = await Municipio.find(filtro).sort({ nombre: 1 });
    res.json(municipios);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar municipios", error: error.message });
  }
});
// ── CORREGIMIENTOS ────────────────────────────────────────────────────────────
// GET /api/ubicacion/corregimientos?municipio=ID
router.get("/corregimientos", async (req, res) => {  // 👈 ruta nueva
  try {
    const filtro = req.query.municipio ? { municipio: req.query.municipio } : {};
    const corregimientos = await Corregimiento.find(filtro).sort({ nombre: 1 });
    res.json(corregimientos);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar corregimientos", error: error.message });
  }
});
// ── LUGARES ───────────────────────────────────────────────────────────────────
// GET /api/ubicacion/lugares
router.get("/lugares", async (req, res) => {
  try {
    const lugares = await Lugar.find()
      .populate("departamento", "nombre")
      .populate("municipio", "nombre")
      .populate("corregimiento", "nombre");
    res.json(lugares);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar lugares", error: error.message });
  }
});

// POST /api/ubicacion/lugares — crea un lugar nuevo y devuelve su ID
// (la oferta referencia a Lugar, entonces hay que crear el lugar primero)
router.post("/lugares", async (req, res) => {
  try {
    const lugar = new Lugar(req.body);
    await lugar.save();
    res.status(201).json(lugar);
  } catch (error) {
    res.status(400).json({ msg: "Error al crear lugar", error: error.message });
  }
});

export default router;
