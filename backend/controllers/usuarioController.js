import Usuario from "../models/usuarios/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import SolicitudRol from "../models/solicitud/SolicitudRol.js";
import Rol from "../models/usuarios/Rol.js";

// Registrar nuevo usuario
const registrar = async (req, res) => {
  const { email, rol } = req.body;

  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    return res.status(400).json({ msg: "Usuario ya registrado" });
  }

  try {
    const rolSolicitado = await Rol.findOne({ nombre: rol });
    const rolInvitado = await Rol.findOne({ nombre: "Invitado" });

    if (!rolSolicitado || !rolInvitado) {
      return res.status(400).json({ msg: "Rol no válido" });
    }

    const usuario = new Usuario(req.body);

    usuario.rol = rolInvitado._id;
    usuario.estado = "pendiente";

    // 🔐 AQUÍ usamos generarToken
    usuario.token_verificacion = generarToken();
    usuario.email_verificado = false;

    await usuario.save();

    await SolicitudRol.create({
      usuario: usuario._id,
      rolSolicitado: rolSolicitado._id,
    });

    res.json({
      msg: "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
      token: usuario.token_verificacion, // SOLO para pruebas en Postman
    });

  } catch (error) {
    console.log(error);
  }
};



// confirmar email
const confirmarEmail = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({
    token_verificacion: token,
  });

  if (!usuario) {
    return res.status(404).json({ msg: "Token inválido" });
  }

  usuario.email_verificado = true;
  usuario.token_verificacion = null;

  await usuario.save();

  res.json({ msg: "Email verificado correctamente" });
};

// OLVIDÉ PASSWORD
import crypto from "crypto";

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no existe" });
  }

  usuario.token_reset = crypto.randomBytes(20).toString("hex");
  usuario.reset_expires = Date.now() + 3600000; // 1 hora

  await usuario.save();

  res.json({
    msg: "Token generado",
    token: usuario.token_reset, // solo para Postman
  });
};


// NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({
    token_reset: token,
    reset_expires: { $gt: Date.now() },
  });

  if (!usuario) {
    return res.status(400).json({ msg: "Token inválido o expirado" });
  }

  usuario.password = password;
  usuario.token_reset = null;
  usuario.reset_expires = null;

  await usuario.save();

  res.json({ msg: "Contraseña actualizada correctamente" });
};


// LOGIN
const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email }).populate("rol");

  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  if (!usuario.email_verificado) {
    return res.status(403).json({
      msg: "Debes verificar tu email primero",
    });
  }

  if (usuario.estado !== "activo") {
    return res.status(403).json({
      msg: "Tu cuenta aún no ha sido aprobada por el administrador",
    });
  }

  const passwordCorrecto = await usuario.comprobarPassword(password);

  if (!passwordCorrecto) {
    return res.status(403).json({ msg: "Password incorrecto" });
  }

  res.json({
    _id: usuario._id,
    username: usuario.username,
    email: usuario.email,
    rol: usuario.rol.nombre,
    token: generarJWT(usuario._id),
  });
};


export {
  registrar,
  confirmarEmail,
  olvidePassword,
    nuevoPassword,
  autenticar,
};

