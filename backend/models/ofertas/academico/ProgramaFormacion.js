import mongoose from "mongoose";

const ProgramaFormacionSchema = new mongoose.Schema({
  codigo: Number,
  version: Number,
  nombre: String,

  tipo_programa: {
    type: String,
    enum: ["COMPLEMENTARIA", "TITULADA"],
    default: "COMPLEMENTARIA"
  },

  duracion: Number,
  duracion_etapa_lectiva: Number,
  duracion_etapa_productiva: Number,
  estado: String,

  nivel_formacion: { type: mongoose.Schema.Types.ObjectId, ref: "NivelFormacion" },
  linea_tecnologica: { type: mongoose.Schema.Types.ObjectId, ref: "LineaTecnologica" },
  red_conocimiento: { type: mongoose.Schema.Types.ObjectId, ref: "RedConocimientos" }
});

export default mongoose.model("ProgramaFormacion", ProgramaFormacionSchema);
