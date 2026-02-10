import mongoose from "mongoose";

const EmpresaSolicitanteSchema = new mongoose.Schema({
  nit: String,
  nombre: String,
  subsector_economico: String
});

export default mongoose.model("EmpresaSolicitante", EmpresaSolicitanteSchema);
