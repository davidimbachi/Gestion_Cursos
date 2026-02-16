//Encargado de solicitudes especiales:

import express from "express";
const router = express.Router();

// Importamos funciones del controlador de solicitudes
import { crearSolicitud, listarSolicitudes, actualizarSolicitud, eliminarSolicitud } from "../controllers/solicitudController.js";

// Middleware para proteger rutas privadas
import checkAuth from "../middleware/checkAuth.js";

// Crear nueva solicitud
router.post("/", checkAuth, crearSolicitud);

// Listar solicitudes del usuario autenticado
router.get("/", checkAuth, listarSolicitudes);

// Actualizar solicitud por ID
router.put("/:id", checkAuth, actualizarSolicitud);

// Eliminar solicitud por ID
router.delete("/:id", checkAuth, eliminarSolicitud);

export default router;