import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import solicitudesRoutes from "./routes/solicitudesRoutes.js";

dotenv.config();

// Crear app
const app = express();

// Conectar DB
conectarDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); // leer JSON

// Routing
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/uploads", express.static("uploads")); // Servir archivos estáticos


// Puerto
const PORT = process.env.PORT || 4000;
// Arrancar servidor
app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
