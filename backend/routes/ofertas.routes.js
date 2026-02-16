//Encargado de crear y administrar ofertas:

import express from "express";
const router = express.Router();

// Importamos funciones del controlador de ofertas
import { crearOferta, listarOfertas, actualizarOferta, eliminarOferta } from "../controllers/ofertaController.js";

// Middleware para proteger rutas privadas
import checkAuth from "../middleware/checkAuth.js";

// Crear nueva oferta (requiere autenticación)
router.post("/", checkAuth, crearOferta);

// Listar todas las ofertas (público)
router.get("/", listarOfertas);

// Actualizar una oferta por ID (requiere autenticación)
router.put("/:id", checkAuth, actualizarOferta);

// Eliminar una oferta por ID (requiere autenticación)
router.delete("/:id", checkAuth, eliminarOferta);

export default router;