import mongoose from "mongoose";

const AmbienteSchema = new mongoose.Schema({
  nombre: String,
  area_metros: Number
});

export default mongoose.model("Ambiente", AmbienteSchema);
