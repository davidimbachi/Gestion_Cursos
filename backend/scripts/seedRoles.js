import mongoose from "mongoose";
import dotenv from "dotenv";
import Rol from "../models/usuarios/Rol.js";

dotenv.config({ path: "./.env" });

console.log("URI:", process.env.MONGO_URI);

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Rol.deleteMany();

    await Rol.insertMany([
      { nombre: "Administrador" },
      { nombre: "Coordinador" },
      { nombre: "Instructor" },
      { nombre: "Funcionario" },
      { nombre: "Curricular" },
      { nombre: "Invitado" },
    ]);

    console.log("✅ Roles insertados correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error insertando roles:", error);
    process.exit(1);
  }
};

seedRoles();
