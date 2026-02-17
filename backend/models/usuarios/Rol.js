import mongoose from "mongoose";

const RolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: [
      "Administrador",
      "Coordinador",
      "Instructor",
      "Funcionario",
      "Curricular",
      "Invitado",
    ],
    required: true,
  },
});

const Rol = mongoose.model("Rol", RolSchema);

export default Rol;
