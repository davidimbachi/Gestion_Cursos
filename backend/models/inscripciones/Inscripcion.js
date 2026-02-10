import mongoose from "mongoose";

const inscripcionSchema = new mongoose.Schema(
  {
    // Relación con Oferta (ForeignKey en Django)
    oferta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Oferta",
      required: true
    },

    nombre: {
      type: String,
      required: true,
      maxlength: 100
    },

    apellido: {
      type: String,
      required: true,
      maxlength: 100
    },

    celular: {
      type: String,
      required: true,
      maxlength: 15
    },

    // Documento PDF (ruta del archivo)
    documento_pdf: {
      type: String, // se guarda la ruta o el nombre
      default: null
    },

    tipo_identificacion: {
      type: String,
      enum: ["TI", "CC"],
      default: "CC"
    },

    numero_identificacion: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20
    },

    tipo_poblacion_aspirante: {
      type: String,
      enum: [
        "Ninguna",
        "Víctima del conflicto",
        "Madre cabeza de familia",
        "Afrocolombiano",
        "Indígena",
        "Discapacitado",
        "Desplazado por la violencia"
      ],
      default: "Ninguna"
    }
  },
  {
    timestamps: {
      createdAt: "fecha_registro",
      updatedAt: false
    }
  }
);

export default mongoose.model("Inscripcion", inscripcionSchema);
