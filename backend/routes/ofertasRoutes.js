//Encargado de crear y administrar ofertas:
import express from "express";
import { 
    crearOferta, 
    listarOfertas, 
    actualizarOferta,
    enviarOferta
} from "../controllers/ofertaController.js";
import { descargarFicha } from "../controllers/ficha.controller.js";
import checkInstructor from "../middleware/checkInstructor.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


// ✅ Así debe quedar — checkAuth siempre primero
router.post("/", checkAuth, checkInstructor, crearOferta);
router.get("/",  checkAuth, listarOfertas);
router.put("/:id", checkAuth, checkInstructor, actualizarOferta);
router.get("/ofertas/:id/ficha", checkAuth, descargarFicha);

export default router;