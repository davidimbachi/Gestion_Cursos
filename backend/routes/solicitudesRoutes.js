import express from "express";
import {
  listarMisSolicitudesOfertas,
  listarSolicitudesOfertasCoordinador,
  aprobarSolicitudOferta,
  rechazarSolicitudOferta
} from "../controllers/solicitudController.js";

import checkAuth from "../middleware/checkAuth.js";
import checkInstructor from "../middleware/checkInstructor.js";
import esCoordinador from "../middleware/esCoordinador.js";

const router = express.Router();

// === Rutas para Instructor ===
// Instructor: ver SUS solicitudes
router.get("/mis-ofertas", checkAuth, checkInstructor, listarMisSolicitudesOfertas);

// === Rutas para Coordinador ===
// Coordinador: ver TODAS las solicitudes
router.get("/coordinador", checkAuth, esCoordinador, listarSolicitudesOfertasCoordinador);
router.put("/:id/aprobar", checkAuth, esCoordinador, aprobarSolicitudOferta);
router.put("/:id/rechazar", checkAuth, esCoordinador, rechazarSolicitudOferta);

export default router;