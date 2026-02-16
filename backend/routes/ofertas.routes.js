//Encargado de crear y administrar ofertas:
import express from "express";
const router = express.Router();

// Importamos funciones del controlador de ofertas
import { crearOferta, listarOfertas, actualizarOferta } from "../controllers/ofertaController.js";

// Middleware para proteger rutas privadas
import checkAuth from "../middleware/checkAuth.js";

router.post("/", checkAuth, crearOferta); // Crear nueva oferta (requiere autenticación)
router.get("/", listarOfertas);// Listar todas las ofertas (público)
router.put("/:id", checkAuth, actualizarOferta);// Actualizar una oferta por ID (requiere autenticación)


export default router;
