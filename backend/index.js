import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import ofertasRoutes from "./routes/ofertasRoutes.js";
import Usuario from "./models/usuarios/usuario.js"; // Importa el modelo Usuario
import Rol from "./models/usuarios/Rol.js";
dotenv.config();

// Crear app
const app = express();

// Conectar DB
conectarDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); // leer JSON

// Middleware para simular usuario con rol
app.use(async (req, res, next) => {
  const usuario = await Usuario.findOne({ email: "wendy@gmail.com" }).populate("rol");  req.usuario = usuario;
  console.log("Usuario cargado:", req.usuario); // <-- para verificar en consola
  next();
});

// Montar routers con prefijos
app.use("/api/ofertas", ofertasRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});