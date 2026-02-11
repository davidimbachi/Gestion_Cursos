import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";

// Configuración
dotenv.config();

// Crear app
const app = express();

// Conectar DB
conectarDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); // leer JSON

// Routing
app.get("/", (req, res) => {
    res.json({ msg: "API funcionando correctamente 🚀" });
});

// Puerto
const PORT = process.env.PORT || 4000;
// Arrancar servidor
app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
