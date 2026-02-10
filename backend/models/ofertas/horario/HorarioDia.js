import mongoose from "mongoose";

const HorarioDiaSchema = new mongoose.Schema({
  oferta: { type: mongoose.Schema.Types.ObjectId, ref: "Oferta" },
  dia: { type: mongoose.Schema.Types.ObjectId, ref: "Dia" },
  horario: { type: mongoose.Schema.Types.ObjectId, ref: "Horario" }
});

export default mongoose.model("HorarioDia", HorarioDiaSchema);
