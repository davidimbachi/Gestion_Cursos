//Encargado de crear y administrar ofertas:
import express from "express";
import { crearOferta, listarOfertas, actualizarOferta } from "../controllers/ofertaController.js";
import checkInstructor from "../middleware/checkInstructor.js";

const router = express.Router();


router.post("/", checkInstructor, crearOferta);
router.get("/", listarOfertas);
router.put("/:id", checkInstructor, actualizarOferta);

export default router;