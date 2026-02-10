import mongoose from "mongoose";

const LugarSchema = new mongoose.Schema({
  departamento: { type: mongoose.Schema.Types.ObjectId, ref: "Departamento" },
  municipio: { type: mongoose.Schema.Types.ObjectId, ref: "Municipio" },
  corregimiento: { type: mongoose.Schema.Types.ObjectId, ref: "Corregimiento" },
  ambiente: String,
  direccion: String
});

export default mongoose.model("Lugar", LugarSchema);
