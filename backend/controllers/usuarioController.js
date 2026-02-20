import Usuario from "../models/usuarios/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import SolicitudRol from "../models/solicitud/SolicitudRol.js";
import Rol from "../models/usuarios/Rol.js";

// Registrar nuevo usuario
const registrar = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      first_name,
      last_name,
      telefono,
      tipo_identificacion,
      numero_identificacion,
      rol,
      coordinador,
      firma_digital,
    } = req.body;

    // ✅ Validar contraseñas
    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden",
      });
    }

    // ✅ Verificar si ya existe email
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
      return res.status(400).json({
        msg: "Usuario ya registrado",
      });
    }

    // ✅ Buscar roles
    const rolSolicitado = await Rol.findOne({ nombre: rol });
    const rolInvitado = await Rol.findOne({ nombre: "Invitado" });

    if (!rolSolicitado || !rolInvitado) {
      return res.status(400).json({
        msg: "Rol no válido",
      });
    }

    // ✅ Validar coordinador si es Instructor
    if (rol === "Instructor" && !coordinador) {
      return res.status(400).json({
        msg: "Debes seleccionar un coordinador",
      });
    }

    //  Crear usuario
    const usuario = new Usuario({
    username,
    email,
    password,
    first_name,
    last_name,
    telefono,
    tipo_identificacion,
    numero_identificacion,
    firma_digital: req.file ? req.file.filename : null,
    coordinador: rol === "Instructor" ? coordinador : null,
    rol: rolInvitado._id,
    email_verificado: false,
    token_verificacion: generarToken(),
  });

    await usuario.save();

    // ✅ Crear solicitud de rol
    await SolicitudRol.create({
      usuario: usuario._id,
      rolSolicitado: rolSolicitado._id,
    });

    res.json({
      msg: "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
      token: usuario.token_verificacion,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
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

  if (!usuario.is_active) {
  return res.status(403).json({
    msg: "Tu cuenta está desactivada por el administrador",
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

