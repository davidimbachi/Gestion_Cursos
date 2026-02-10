import mongoose from "mongoose";

const DiaSchema = new mongoose.Schema({
  nombre: String
});

export default mongoose.model("Dia", DiaSchema);
