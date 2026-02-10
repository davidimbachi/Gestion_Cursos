import mongoose from "mongoose";

const HorarioSchema = new mongoose.Schema({
  hora_inicio: String,
  hora_fin: String
});

export default mongoose.model("Horario", HorarioSchema);
