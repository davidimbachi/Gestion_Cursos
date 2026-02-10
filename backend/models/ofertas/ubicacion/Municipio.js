import mongoose from "mongoose";

const MunicipioSchema = new mongoose.Schema({
  nombre: String,
  departamento: { type: mongoose.Schema.Types.ObjectId, ref: "Departamento" }
});

export default mongoose.model("Municipio", MunicipioSchema);
