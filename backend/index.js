import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import ofertasRoutes from "./routes/ofertasRoutes.js";
import programaRoutes from "./routes/programaRoutes.js";
import ubicacionRoutes from "./routes/ubicacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import catalogosRoutes from "./routes/catalogosRoutes.js";
import Usuario from "./models/usuarios/Usuario.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import solicitudesRoutes from "./routes/solicitudesRoutes.js";

dotenv.config();

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

// Middleware para simular usuario con rol
// Routing
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/uploads", express.static("uploads")); // Servir archivos estáticos

app.use(async (req, res, next) => {
  const usuario = await Usuario.findOne({ email: "wendy@gmail.com" }).populate('rol');
  console.log('✅ Usuario cargado:', usuario?.email);
  console.log('✅ Rol cargado:', usuario?.rol);
  req.usuario = usuario;
  next();
});

// Rutas
app.use("/api/ofertas",    ofertasRoutes);
app.use("/api/programas",  programaRoutes);
app.use("/api/ubicacion",  ubicacionRoutes);
app.use("/api/empresas",   empresaRoutes);
app.use("/api/catalogos",  catalogosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});