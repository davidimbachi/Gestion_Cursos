import mongoose from "mongoose";

const ProgramaEspecialSchema = new mongoose.Schema({
  nombre: String
});

export default mongoose.model("ProgramaEspecial", ProgramaEspecialSchema);
