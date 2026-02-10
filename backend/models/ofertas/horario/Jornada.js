import mongoose from "mongoose";

const JornadaSchema = new mongoose.Schema({
  nombre: String
});

export default mongoose.model("Jornada", JornadaSchema);
