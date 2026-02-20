import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    token_reset: String,
    reset_expires: Date,
    firma_digital: String,
    is_active: {
      type: Boolean,
      default: true,
    },
      coordinador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  },
  { timestamps: true }
);

//  Hook para encriptar contraseña antes de guardar
UsuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


//  Método para comprobar contraseña en login
UsuarioSchema.methods.comprobarPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

const Usuario = mongoose.model("Usuario", UsuarioSchema);
export default Usuario;