import express from "express";
import {
  listarMisSolicitudesOfertas,
  obtenerSolicitud,
  listarSolicitudesOfertasCoordinador,
  aprobarSolicitudOferta,
  rechazarSolicitudOferta,
  listarSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
  actualizarSolicitud
} from "../controllers/solicitudController.js";

import checkAuth from "../middleware/checkAuth.js";
import checkInstructor from "../middleware/checkInstructor.js";
import esCoordinador from "../middleware/esCoordinador.js";
import esAdmin from "../middleware/esAdmin.js";



const router = express.Router();

// === Rutas para Instructor ===
// Instructor: ver SUS solicitudes
router.get("/mis-ofertas", checkAuth, checkInstructor, listarMisSolicitudesOfertas);

// === Rutas para Coordinador ===
// Coordinador: ver TODAS las solicitudes
router.get("/coordinador", checkAuth, esCoordinador, listarSolicitudesOfertasCoordinador);
router.put("/:id/aprobar", checkAuth, esCoordinador, aprobarSolicitudOferta);
router.put("/:id/rechazar", checkAuth, esCoordinador, rechazarSolicitudOferta);
router.put("/:id", checkAuth, esCoordinador, actualizarSolicitud);

// Admin
router.get("/", checkAuth, esAdmin, listarSolicitudesPendientes);
router.put("/aprobar/:id", checkAuth, esAdmin, aprobarSolicitud);
router.put("/rechazar/:id", checkAuth, esAdmin, rechazarSolicitud);

// Instructor: obtener una sola solicitud (para actualizar comentarios) - VA ÚLTIMO
router.get("/:id", checkAuth, checkInstructor, obtenerSolicitud);

export default router;