import express from 'express';
import ProgramaFormacion from '../models/ofertas/academico/ProgramaFormacion.js';
import Sector from '../models/ofertas/academico/Sector.js'; // ← NUEVO


const router = express.Router();


// Duraciones únicas desde programa_formacion
router.get('/duraciones', async (req, res) => {
  try {
    const duraciones = await ProgramaFormacion.distinct('duracion');
    res.json(duraciones.sort((a, b) => a - b));
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener duraciones' });
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
