import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Importar routers
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import ofertasRoutes from "./routes/ofertas.routes.js";
import inscripcionesRoutes from "./routes/inscripciones.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";


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
app.use("/api/usuarios", usuarioRoutes);


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
