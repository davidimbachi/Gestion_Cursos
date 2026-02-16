import mongoose from "mongoose";

const { Schema } = mongoose;

const ESTADOS_ROL = ["pendiente", "aprobada", "rechazada"];

const solicitudRolSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    rolSolicitado: {
      type: String,
      required: true,
    },

    estado: {
      type: String,
      enum: ESTADOS_ROL,
      default: "pendiente",
    },

    revisadoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    fechaRevision: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: false,
    },
  }
);

const SolicitudRol = mongoose.model("SolicitudRol", solicitudRolSchema);

export default SolicitudRol;
