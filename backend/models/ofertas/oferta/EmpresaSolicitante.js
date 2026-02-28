import mongoose from "mongoose";

const EmpresaSolicitanteSchema = new mongoose.Schema({
  nit:                  { type: String },
  nombre:               { type: String },
  subsector_economico:  { type: String },

  // ── Campos REGULAR ──────────────────────────────
  hace_parte_convenio:       { type: String, enum: ['SI', 'NO'], default: 'NO' },
  cual_convenio:             { type: String },
  fecha_creacion:            { type: Date },
  tipo_empresa:              { 
    type: String, 
    enum: ['PUBLICA', 'PRIVADA', 'MIXTA', 'SAS', 'LTDA', 'ONG', 'UNIPERSONAL', 'OTRA'] 
  },
  direccion_empresa:         { type: String },
  nombre_representante_legal:{ type: String },
  nombre_contacto:           { type: String },
  celular_contacto:          { type: String },
  correo_contacto:           { type: String },
  numero_empleados:          { type: Number },
}, { timestamps: true });

export default mongoose.model("EmpresaSolicitante", EmpresaSolicitanteSchema);