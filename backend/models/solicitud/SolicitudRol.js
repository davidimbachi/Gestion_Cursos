import mongoose from "mongoose";

const SolicitudRolSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  rolSolicitado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rol",
    required: true,
  },

  estado: {
    type: String,
    enum: ["pendiente", "aprobada", "rechazada"],
    default: "pendiente",
  },

  revisadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null,
  },

  fechaRevision: {
    type: Date,
    default: null,
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SolicitudRol", SolicitudRolSchema);
