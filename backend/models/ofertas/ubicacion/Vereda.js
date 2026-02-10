import mongoose from "mongoose";

const VeredaSchema = new mongoose.Schema({
  nombre: String,
  corregimiento: { type: mongoose.Schema.Types.ObjectId, ref: "Corregimiento" }
});

export default mongoose.model("Vereda", VeredaSchema);
