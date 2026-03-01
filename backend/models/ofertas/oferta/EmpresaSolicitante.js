import mongoose from "mongoose";

const EmpresaSolicitanteSchema = new mongoose.Schema({
  // ── Discriminador ──────────────────────────────
  tipo: {
    type: String,
    enum: ['REGULAR', 'CAMPESENA'],
    required: true,
    default: 'REGULAR'
  },

  // ── Campos compartidos ──────────────────────────
  nit:                  { type: String },
  nombre:               { type: String },
  subsector_economico:  { type: String },
  direccion_empresa:    { type: String },
  nombre_contacto:      { type: String },
  celular_contacto:     { type: String },
  correo_contacto:      { type: String },

  // ── Solo REGULAR ────────────────────────────────
  cual_convenio:              { type: String },
  fecha_creacion:             { type: Date },
  tipo_empresa:               { type: mongoose.Schema.Types.ObjectId, ref: 'EmpresaSolicitanteCatalogo' },
  nombre_representante_legal: { type: String },
  numero_empleados:           { type: Number },

  // ── Solo CAMPESENA ──────────────────────────────
  // Instructor Técnico
  instructor_tecnico_nombre:  { type: String },
  instructor_tecnico_correo:  { type: String },
  instructor_tecnico_celular: { type: String },
  instructor_tecnico_mes1:    { type: String },
  instructor_tecnico_mes2:    { type: String },
  instructor_tecnico_mes3:    { type: String },
  instructor_tecnico_mes4:    { type: String },
  instructor_tecnico_mes5:    { type: String },

  // Instructor Empresarial
  instructor_empresarial_nombre:  { type: String },
  instructor_empresarial_correo:  { type: String },
  instructor_empresarial_celular: { type: String },
  instructor_empresarial_mes1:    { type: String },
  instructor_empresarial_mes2:    { type: String },
  instructor_empresarial_mes3:    { type: String },
  instructor_empresarial_mes4:    { type: String },
  instructor_empresarial_mes5:    { type: String },

  // Instructor Full Popular
  instructor_fullpopular_nombre:  { type: String },
  instructor_fullpopular_correo:  { type: String },
  instructor_fullpopular_celular: { type: String },
  instructor_fullpopular_mes1:    { type: String },
  instructor_fullpopular_mes2:    { type: String },

  // Tipo empresa CAMPESENA (MIXTA, PRIVADA, PÚBLICA)
  tipo_empresa_campesena: { type: mongoose.Schema.Types.ObjectId, ref: 'EmpresaSolicitanteCatalogo' },

  // Datos empresa CAMPESENA
  fecha_creacion_campesena:             { type: Date },
  nombre_representante_legal_campesena: { type: String },
  numero_empleados_campesena:           { type: Number },

}, { timestamps: true });

export default mongoose.model("EmpresaSolicitante", EmpresaSolicitanteSchema);