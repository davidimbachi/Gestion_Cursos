import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const OfertaSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    
    modalidad_oferta: { 
      type: String, 
      enum: ['CAMPESENA', 'REGULAR'],
      default: 'REGULAR'
    },
    
    tipo_oferta: {
      type: String,
      enum: ['ABIERTA', 'CERRADA'],
      default: 'ABIERTA'
    },
    
    carta_empresa: { type: String },
    
    programa: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaFormacion", required: true },
    modalidad_programa: { type: mongoose.Schema.Types.ObjectId, ref: "ModalidadPrograma" },
    lugar: { type: mongoose.Schema.Types.ObjectId, ref: "Lugar", required: true },
    
    estado_enviada: { type: Boolean, default: false },
    cupo: { type: Number, default: 25 },
    
    empresa_solicitante: { type: mongoose.Schema.Types.ObjectId, ref: "EmpresaSolicitante" },
    programa_especial: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaEspecial" },
    
    codigo_ficha: { type: String },
    codigo_solicitud: { type: String },
    
    fecha_inicio: { type: Date, required: true },
    fecha_terminacion: { type: Date },
    fecha_inscripcion: { type: Date, required: true },
    
    caracterizacion_generada: { type: String },
    carta_solicitud: { type: String, default: '' },
    masivo_aprendices: { type: String },
    
    token_inscripcion: { 
      type: String, 
      unique: true,
      sparse: true
    }
  },
  { 
    timestamps: true 
  }
);


OfertaSchema.pre('save', async function() {
  // Solo generar token si es nuevo y no tiene uno
  if (this.isNew && !this.token_inscripcion) {
    this.token_inscripcion = uuidv4();
    
  }
});

export default mongoose.model("Oferta", OfertaSchema);