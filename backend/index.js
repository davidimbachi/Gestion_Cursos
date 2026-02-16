import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import ofertasRoutes from "./routes/ofertasRoutes.js";

dotenv.config();

// Crear app
const app = express();

// Conectar DB
conectarDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); // leer JSON




// Montar routers con prefijos

app.use("/api/ofertas", ofertasRoutes);



// Puerto
const PORT = process.env.PORT || 4000;
// Arrancar servidor
app.listen(4000, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
