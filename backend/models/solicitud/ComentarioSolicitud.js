import mongoose from "mongoose";
import { ESTADOS } from "./Solicitud.js";

const { Schema } = mongoose;

const comentarioSolicitudSchema = new Schema(
  {
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: "Solicitud",
      required: true,
    },

    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    contenido: {
      type: String,
      required: true,
    },

    tipo: {
      type: String,
      enum: ESTADOS,
      default: "revision",
    },

    esInterno: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: false,
    },
  }
);

const ComentarioSolicitud = mongoose.model("ComentarioSolicitud", comentarioSolicitudSchema);

export default ComentarioSolicitud;
