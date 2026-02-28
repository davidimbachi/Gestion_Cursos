import express from 'express';
import ProgramaFormacion from '../models/ofertas/academico/ProgramaFormacion.js';
import Sector from '../models/ofertas/academico/Sector.js'; // ← NUEVO


const router = express.Router();

// GET /api/programas?duracion=40
// GET /api/programas        (sin filtro, devuelve todos)
router.get('/', async (req, res) => {
  try {
    const { duracion } = req.query;
    const query = {};
    if (duracion) query.duracion = parseInt(duracion);
    const programas = await ProgramaFormacion.find(query).sort({ nombre: 1 });
    res.json(programas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar programas', error: error.message });
  }
});

// GET /api/programas/buscar?duracion=40&texto=sistemas
router.get('/buscar', async (req, res) => {
  try {
    const { duracion, texto } = req.query;
    const query = {};
    if (duracion) query.duracion = parseInt(duracion);
    if (texto && texto.length >= 2) query.nombre = { $regex: texto, $options: 'i' };
    const programas = await ProgramaFormacion.find(query).limit(10);
    res.json(programas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar programas', error: error.message });
  }
});
// ── NUEVO ──────────────────────────────────────────────
// GET /api/programas/sectores
router.get('/sectores', async (req, res) => {
  try {
    const sectores = await Sector.find().sort({ codigo: 1 });
    res.json(sectores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar sectores', error: error.message });
  }
});
//
export default router;
