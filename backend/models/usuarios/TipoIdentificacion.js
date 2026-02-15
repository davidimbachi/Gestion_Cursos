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

const TipoIdentificacion = mongoose.model("TipoIdentificacion", TipoIdentificacionSchema);

export default TipoIdentificacion;
