//Encargado de inscribir usuarios en cursos/ofertas:

import express from "express";
const router = express.Router();

// Importamos funciones del controlador de inscripciones
import { inscribirUsuario, listarInscripciones, cancelarInscripcion } from "../controllers/inscripcionController.js";

// Middleware para proteger rutas privadas
import checkAuth from "../middleware/checkAuth.js";

// Inscribir un usuario en una oferta/curso
router.post("/", checkAuth, inscribirUsuario);

// Listar inscripciones del usuario autenticado
router.get("/", checkAuth, listarInscripciones);

// Cancelar una inscripción por ID
router.delete("/:id", checkAuth, cancelarInscripcion);

export default router;