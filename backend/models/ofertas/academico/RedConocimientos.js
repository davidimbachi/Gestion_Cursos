import mongoose from "mongoose";

const RedConocimientosSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 255 }
});

export default mongoose.model("RedConocimientos", RedConocimientosSchema);
