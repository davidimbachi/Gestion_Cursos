//Encargado de crear y administrar ofertas:
import express from "express";
import { crearOferta, listarOfertas, actualizarOferta } from "../controllers/ofertaController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


router.post("/", checkAuth, crearOferta); // Crear nueva oferta (requiere autenticación)
router.get("/", listarOfertas);// Listar todas las ofertas (público)
router.put("/:id", checkAuth, actualizarOferta);// Actualizar una oferta por ID (requiere autenticación)


export default router;
