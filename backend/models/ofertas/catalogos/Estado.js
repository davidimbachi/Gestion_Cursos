import mongoose from "mongoose";

const EstadoSchema = new mongoose.Schema({
  nombre: String
});

export default mongoose.model("Estado", EstadoSchema);
