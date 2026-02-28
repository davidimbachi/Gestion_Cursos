import mongoose from 'mongoose';

const EmpresaOfertaSchema = new mongoose.Schema({
  cual_convenio:               { type: String, default: '' },
  nombre:                      { type: String, required: true },
  nit:                         { type: String },
  fecha_creacion:              { type: Date },
  tipo_empresa:                { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EmpresaSolicitante'   // ← referencia al catálogo que ya tienes
  },
  direccion:                   { type: String },
  nombre_representante_legal:  { type: String },
  nombre_contacto:             { type: String },
  celular_contacto:            { type: String },
  correo_contacto:             { type: String },
  numero_empleados:            { type: Number },
}, { 
  timestamps: true,
  collection: 'empresas_oferta'
});

export default mongoose.model('EmpresaOferta', EmpresaOfertaSchema);