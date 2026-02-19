import mongoose from "mongoose";

const OfertaSchema = new mongoose.Schema(
  {
    idFicha: { type: Number, required: true },
    codigo: { type: String, required: true },
    cupo: { type: Number, required: true },

    // Fechas y horarios
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    horaInicio: { type: String },
    horaFin: { type: String },
    diasFormacion: { type: String },

    // Información adicional
    subsectorEconomico: { type: String },
    convenio: { type: String },
    codigoSolicitud: { type: String },
    enlaceInscripcion: { type: String },

    // Documentos y caracterización
    firmaDigital: { type: String },
    fichaCaracterizacion: { type: String },

    // Ubicación y relaciones
    departamento: { type: String },
    municipio: { type: mongoose.Schema.Types.ObjectId, ref: "Municipio" },
    programaFormacion: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaFormacion" },
    modalidad: { type: mongoose.Schema.Types.ObjectId, ref: "Modalidad" },
    centro: { type: mongoose.Schema.Types.ObjectId, ref: "Centro" },
    estado: { type: mongoose.Schema.Types.ObjectId, ref: "Estado" },
    ambiente: { type: mongoose.Schema.Types.ObjectId, ref: "Ambiente" },

    // Relación con programas especiales y solicitantes
    programaEspecial: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaEspecial" },
    empresaSolicitante: { type: mongoose.Schema.Types.ObjectId, ref: "EmpresaSolicitante" },

    // Instructor que crea la oferta
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Oferta", OfertaSchema);