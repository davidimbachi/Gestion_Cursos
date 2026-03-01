import express from "express";
import ProgramaEspecial from "../models/ofertas/oferta/ProgramaEspecial.js";
import TipoOferta from "../models/ofertas/oferta/TipoOferta.js";
import ModalidadOferta from "../models/ofertas/oferta/ModalidadOferta.js";
import EmpresaSolicitanteCatalogo from "../models/ofertas/oferta/EmpresaSolicitanteCatalogo.js";


const router = express.Router();

router.get("/programas-especiales", async (req, res) => {
  try {
    const programas = await ProgramaEspecial.find().sort({ nombre: 1 });
    res.json(programas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar programas especiales", error: error.message });
  }
});

router.get('/tipos-oferta', async (req, res) => {
  try {
    const tipos = await TipoOferta.find().lean();
    res.json(tipos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener tipos de oferta' });
  }
});

// Modalidades de oferta
router.get('/modalidades-oferta', async (req, res) => {
  try {
    const modalidades = await ModalidadOferta.find().lean();
    res.json(modalidades);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener modalidades' });
  }
});

// GET /api/catalogos/tipos-empresa?modalidad=REGULAR  o  ?modalidad=CAMPESENA
router.get("/tipos-empresa", async (req, res) => {
  try {
    // IDs de modalidad_oferta
    const IDS = {
      REGULAR:   '6994f34176e0c80c5e9846d2',
      CAMPESENA: '6994f34176e0c80c5e9846d5'
    };
    const categoriaId = IDS[req.query.modalidad] || IDS.REGULAR;
    const tipos = await EmpresaSolicitanteCatalogo
      .find({ categoria: categoriaId })
      .sort({ nombre: 1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ msg: "Error", error: error.message });
  }
})
export default router;