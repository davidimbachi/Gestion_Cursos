import mongoose from "mongoose";

const CorregimientoSchema = new mongoose.Schema({
  nombre: String,
  municipio: { type: mongoose.Schema.Types.ObjectId, ref: "Municipio" }
});

export default mongoose.model("Corregimiento", CorregimientoSchema);
