import mongoose from "mongoose";

const DepartamentoSchema = new mongoose.Schema({
  nombre: String
});

export default mongoose.model("Departamento", DepartamentoSchema);
