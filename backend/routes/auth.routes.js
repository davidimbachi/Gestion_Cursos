//Encargado de login, registro y recuperación de contraseña:

import express from "express";
const router = express.Router();

// Importamos las funciones del controlador de autenticación
import { login, registrar, confirmarCuenta, olvidePassword, nuevoPassword } from "../controllers/authController.js";

// Ruta para iniciar sesión
router.post("/login", login);

// Ruta para registrar un nuevo usuario
router.post("/registrar", registrar);

// Ruta para confirmar cuenta con token
router.get("/confirmar/:token", confirmarCuenta);

// Ruta para solicitar recuperación de contraseña
router.post("/olvide-password", olvidePassword);

// Ruta para asignar nueva contraseña con token
router.post("/olvide-password/:token", nuevoPassword);

export default router;