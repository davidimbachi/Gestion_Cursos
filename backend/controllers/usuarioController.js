import Usuario from "../models/usuarios/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarToken from "../helpers/generarToken.js";
import SolicitudRol from "../models/solicitud/SolicitudRol.js";
import Rol from "../models/usuarios/Rol.js";
import crypto from "crypto";
import { sendResetPasswordEmail,sendVerificationEmail } from '../config/email.js';


// Registrar nuevo usuario

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
      tipo_programa,
      coordinadorAsignado, // ← AGREGADO
      firma_digital,
    } = req.body;

    //  Validar contraseñas
    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden",
      });
    }

    //  Verificar si ya existe email
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
      return res.status(400).json({
        msg: "Usuario ya registrado",
      });
    }

    //  Buscar roles
    const rolSolicitado = await Rol.findOne({ nombre: rol });
    const rolInvitado = await Rol.findOne({ nombre: "Invitado" });

    if (!rolSolicitado || !rolInvitado) {
      return res.status(400).json({
        msg: "Rol no válido",
      });
    }

    // ✅ Validar si es Instructor
    if (rol === "Instructor") {
      if (!tipo_programa) {
        return res.status(400).json({ msg: "Debes seleccionar un tipo de programa" });
      }
      if (!coordinadorAsignado) {
        return res.status(400).json({ msg: "Debes seleccionar un coordinador" });
      }

      // Verificar que el coordinador existe, está activo y pertenece al tipo correcto
      const rolCoordinador = await Rol.findOne({ nombre: "Coordinador" });
      const coordinadorValido = await Usuario.findOne({
        _id: coordinadorAsignado,
        rol: rolCoordinador._id,
        tipo_programa,
        is_active: true,
      });

      if (!coordinadorValido) {
        return res.status(400).json({
          msg: "El coordinador no es válido para este tipo de programa",
        });
      }
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
      tipo_programa: rol === "Instructor" ? tipo_programa : null,
      coordinadorAsignado: rol === "Instructor" ? coordinadorAsignado : null, // ← AGREGADO
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
    // Enviar correo de verificación
        
    try {
      await sendVerificationEmail(usuario.email, usuario.token_verificacion);
      res.json({
        msg: "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
      });
    } catch (error) {
      console.error("Error enviando correo de verificación:", error);
      res.json({
        msg: "Registro exitoso, pero no se pudo enviar el correo de verificación. Contacta al administrador.",
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
    

// ✅ Obtener coordinadores por tipo de programa
const obtenerCoordinadores = async (req, res) => {
  try {
    const { tipo_programa } = req.query;

    const rolCoordinador = await Rol.findOne({ nombre: "Coordinador" });

    if (!rolCoordinador) {
      return res.status(404).json({ msg: "Rol coordinador no encontrado" });
    }

    const filtro = {
      rol: rolCoordinador._id,
      ...(tipo_programa && { tipo_programa }),
    };

    const coordinadores = await Usuario.find(filtro).select(
       "_id nombre first_name last_name tipo_programa"
    );

    res.json(coordinadores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener coordinadores" });
  }
};

// Confirmar email
const confirmarEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // 1️⃣ Buscar usuario por token
    const usuario = await Usuario.findOne({ token_verificacion: token });

    // 2️⃣ Si no se encuentra por token
    if (!usuario) {
      // Verificar si el token ya fue usado
      const usuarioYaVerificado = await Usuario.findOne({
        email_verificado: true,
      });

      if (usuarioYaVerificado) {
        return res.status(200).json({
          msg: "Este correo ya fue verificado anteriormente. Puedes iniciar sesión.",
        });
      }

      return res.status(404).json({
        msg: "El enlace es inválido o ha expirado",
      });
    }

    // Confirmar email
    usuario.email_verificado = true;
    usuario.token_verificacion = null;
    await usuario.save();

    return res.json({
      msg: "Email verificado correctamente. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// OLVIDÉ PASSWORD
const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no existe" });
  }

  usuario.token_reset = crypto.randomBytes(20).toString("hex");
  usuario.reset_expires = Date.now() + 3600000; // 1 hora

  await usuario.save();

  // Enviar correo
  try {
    await sendResetPasswordEmail(email, usuario.token_reset);
    res.json({ msg: "Correo enviado con las instrucciones" });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ msg: "Error al enviar el correo" });
  }
};

// NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
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

    return res.json({ msg: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error en nuevoPassword:", error);
    return res.status(500).json({
      msg: "Error al actualizar la contraseña",
    });
  }
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
  obtenerCoordinadores,
};