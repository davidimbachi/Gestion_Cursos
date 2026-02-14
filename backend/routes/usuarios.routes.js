//import express from "express";
const router = express.Router();

import {registrar,login,confirmarToken,olvidePassword,nuevoPassword,perfil} from "../controllers/usuarioController.js";

// import checkAuth from "../middleware/checkAuth.js";

// Crear usuario
router.post("/", registrar);
// Login
router.post("/login", login);
// Confirmar cuenta con token
router.get("/confirmar/:token", confirmarToken);
// Olvidé password
router.post("/olvide-password", olvidePassword);
// Reset password con token
router.post("/olvide-password/:token", nuevoPassword);
// Perfil protegido
router.get("/perfil", checkAuth, perfil);

export default router;