//Encargado de crear y administrar ofertas:
import express from "express";
import { crearOferta, listarOfertas, actualizarOferta } from "../controllers/ofertaController.js";
import checkInstructor from "../middleware/checkInstructor.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


router.post("/", checkInstructor, crearOferta);
router.get("/",  checkAuth,listarOfertas);
router.put("/:id", checkInstructor, actualizarOferta);

export default router;