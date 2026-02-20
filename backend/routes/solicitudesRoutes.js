import express from "express";
const router = express.Router();

import {
  listarSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
} from "../controllers/solicitudController.js";

import checkAuth from "../middleware/checkAuth.js";
import esAdmin from "../middleware/esAdmin.js";

// Admin
router.get("/", checkAuth, esAdmin, listarSolicitudesPendientes);
router.put("/aprobar/:id", checkAuth, esAdmin, aprobarSolicitud);
router.put("/rechazar/:id", checkAuth, esAdmin, rechazarSolicitud);

export default router;
