import mongoose from "mongoose";

const OfertaSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },

    modalidad_oferta: {
      type: String,
      enum: ["CAMPESENA", "REGULAR"],
      default: "REGULAR"
    },

    tipo_oferta: {
      type: String,
      enum: ["ABIERTA", "CERRADA"],
      default: "ABIERTA"
    },

    entorno_geografico: {
      type: String,
      enum: ["RURAL", "URBANO"],
      default: "URBANO"
    },

    programa: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaFormacion" },
    modalidad_programa: { type: mongoose.Schema.Types.ObjectId, ref: "ModalidadPrograma" },
    lugar: { type: mongoose.Schema.Types.ObjectId, ref: "Lugar" },

    estado_enviada: Boolean,
    cupo: Number,

    empresa_solicitante: { type: mongoose.Schema.Types.ObjectId, ref: "EmpresaSolicitante" },
    programa_especial: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaEspecial" },

    ficha: String,
    codigo_de_solicitud: String,

    fecha_inicio: Date,
    fecha_terminacion: Date,
    fecha_de_inscripcion: Date,

    caracterizacion_generada: String,
    carta_solicitud: String,
    masivo_aprendices: String,

    archivos_aprendices: String,

    token_inscripcion: { type: String, unique: true },
    link_generado: Boolean
  },
  { timestamps: true }
);

export default mongoose.model("Oferta", OfertaSchema);
