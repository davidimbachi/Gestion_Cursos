import mongoose from "mongoose";

const NivelFormacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 120 }
});

export default mongoose.model("NivelFormacion", NivelFormacionSchema);
