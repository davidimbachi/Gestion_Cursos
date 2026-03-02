import mongoose from "mongoose";

const { Schema } = mongoose;

const ESTADOS = ["pendiente", "aprobada", "rechazada", "revision"];

const solicitudSchema = new Schema(
  {
    oferta: {
      type: Schema.Types.ObjectId,
      ref: "Oferta",
      required: true,
    },

    coordinador: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",   // debía apuntar al modelo Usuario
      default: null,
    },

    solicitante: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    estado: {
      type: String,
      enum: ESTADOS,
      default: "revision",
    },

    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    fechaRevision: {
      type: Date,
      default: null,
    },

    fechaUltimoCambio: {
      type: Date,
      default: Date.now,
    },

    usuarioUltimoCambio: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    observaciones: {
      type: String,
      default: null,
    },

    motivoRechazo: {
      type: String,
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
const Solicitud = mongoose.model("Solicitud", solicitudSchema);

export default Solicitud;
