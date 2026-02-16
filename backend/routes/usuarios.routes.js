//Encargado de perfil y gestión de usuarios

import express from "express";
const router = express.Router();

// Importamos funciones del controlador de usuarios
import { perfil, actualizarPerfil } from "../controllers/usuarioController.js";

// Middleware para proteger rutas privadas
import checkAuth from "../middleware/checkAuth.js";

// Ruta para obtener perfil del usuario autenticado
router.get("/perfil", checkAuth, perfil);

// Ruta para actualizar perfil del usuario autenticado
router.put("/perfil", checkAuth, actualizarPerfil);

export default router;