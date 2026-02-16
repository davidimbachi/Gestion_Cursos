import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
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


// Montar routers con prefijos
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/ofertas", ofertasRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);
app.use("/api/solicitudes", solicitudesRoutes);


// Puerto
const PORT = process.env.PORT || 4000;
// Arrancar servidor
app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
