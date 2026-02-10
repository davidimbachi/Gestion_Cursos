import mongoose from "mongoose";

const TipoIdentificacionSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: false }
);

export default mongoose.model(
  "TipoIdentificacion",
  TipoIdentificacionSchema
);
