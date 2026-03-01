import mongoose from 'mongoose';

const EmpresaOfertaSchema = new mongoose.Schema({
  // ── Discriminador ──────────────────────────────
  tipo: {
    type: String,
    enum: ['REGULAR', 'CAMPESENA'],
    required: true,
    default: 'REGULAR'
  },

  // ── Campos compartidos ─────────────────────────
  nombre:          { type: String, required: true },
  nit:             { type: String },
  direccion:       { type: String },
  nombre_contacto: { type: String },
  celular_contacto:{ type: String },
  correo_contacto: { type: String },

  // ── Solo REGULAR ───────────────────────────────
  cual_convenio:              { type: String, default: '' },
  fecha_creacion:             { type: Date },
  tipo_empresa:               { type: mongoose.Schema.Types.ObjectId, ref: 'EmpresaSolicitanteCatalogo' },
  nombre_representante_legal: { type: String },
  numero_empleados:           { type: Number },

  // ── Solo CAMPESENA ─────────────────────────────
  // Datos empresa
  fecha_creacion_campesena:             { type: Date },
  tipo_empresa_campesena:               { type: mongoose.Schema.Types.ObjectId, ref: 'EmpresaSolicitanteCatalogo' },
  nombre_representante_legal_campesena: { type: String },
  numero_empleados_campesena:           { type: Number },

  // Instructor Técnico
  inst_tecnico_nombre:  { type: String },
  inst_tecnico_correo:  { type: String },
  inst_tecnico_celular: { type: String },
  inst_tecnico_mes1:    { type: String },
  inst_tecnico_mes2:    { type: String },
  inst_tecnico_mes3:    { type: String },
  inst_tecnico_mes4:    { type: String },
  inst_tecnico_mes5:    { type: String },

  // Instructor Empresarial
  inst_empresarial_nombre:  { type: String },
  inst_empresarial_correo:  { type: String },
  inst_empresarial_celular: { type: String },
  inst_empresarial_mes1:    { type: String },
  inst_empresarial_mes2:    { type: String },
  inst_empresarial_mes3:    { type: String },
  inst_empresarial_mes4:    { type: String },
  inst_empresarial_mes5:    { type: String },

  // Instructor Full Popular
  inst_fullpopular_nombre:  { type: String },
  inst_fullpopular_correo:  { type: String },
  inst_fullpopular_celular: { type: String },
  inst_fullpopular_mes1:    { type: String },
  inst_fullpopular_mes2:    { type: String },

}, {
  timestamps: true,
  collection: 'empresas_oferta'
});

export default mongoose.model('EmpresaOferta', EmpresaOfertaSchema);