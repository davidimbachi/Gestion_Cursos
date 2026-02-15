import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    first_name: String,
    last_name: String,

    telefono: {
      type: String,
      match: /^3\d{9}$/,
    },

    tipo_identificacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TipoIdentificacion",
    },

    numero_identificacion: {
      type: String,
      minlength: 5,
    },

    red_conocimientos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RedConocimientos",
      default: null,
    },

    rol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rol",
      required: true,
    },

    es_verificado: {
      type: Boolean,
      default: false,
    },

    email_verificado: {
      type: Boolean,
      default: false,
    },

    token_verificacion: String,

    firma_digital: {
      type: String, // URL o path
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;