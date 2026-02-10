import mongoose from "mongoose";

const LineaTecnologicaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 255 }
});

export default mongoose.model("LineaTecnologica", LineaTecnologicaSchema);
