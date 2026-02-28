import express from "express";
import {
  // Solicitudes de Rol (Admin)
  listarSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
  // Solicitudes de Ofertas (Instructor/Coordinador)
  listarMisSolicitudesOfertas,
  listarSolicitudesOfertasCoordinador,
  aprobarSolicitudOferta,
  rechazarSolicitudOferta
} from "../controllers/solicitudController.js";

import checkAuth from "../middleware/checkAuth.js";
import esAdmin from "../middleware/esAdmin.js";
import checkInstructor from "../middleware/checkInstructor.js";

const router = express.Router();

// === Rutas existentes (SolicitudRol - Admin) ===
router.get("/roles", checkAuth, esAdmin, listarSolicitudesPendientes);
router.put("/roles/aprobar/:id", checkAuth, esAdmin, aprobarSolicitud);
router.put("/roles/rechazar/:id", checkAuth, esAdmin, rechazarSolicitud);

// === NUEVAS Rutas (Solicitud de Ofertas) ===
// Instructor: ver SUS solicitudes
router.get("/mis-ofertas", checkAuth, checkInstructor, listarMisSolicitudesOfertas);

// Coordinador: ver TODAS las solicitudes
router.get("/coordinador", checkAuth, listarSolicitudesOfertasCoordinador);
router.put("/:id/aprobar", checkAuth, aprobarSolicitudOferta);
router.put("/:id/rechazar", checkAuth, rechazarSolicitudOferta);

export default router;