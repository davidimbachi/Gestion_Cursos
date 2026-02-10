import mongoose from "mongoose";

const ModalidadProgramaSchema = new mongoose.Schema({
  nombre: String
});

export default mongoose.model("ModalidadPrograma", ModalidadProgramaSchema);
