import jwt from "jsonwebtoken";
import Usuario from "../models/usuarios/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;

  console.log('🔹 Headers recibidos:', req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('🔹 Token extraído:', token ? 'Sí hay token' : 'No hay token');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔹 Token decodificado:', decoded);

      req.usuario = await Usuario.findById(decoded.id)
        .select("-password")
        .populate("rol");

      console.log('🔹 Usuario encontrado:', req.usuario ? 'Sí' : 'No');
      console.log('🔹 Datos del usuario:', req.usuario);

      if (!req.usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      // ✅ Agregar las propiedades adicionales
      req.usuarioId = req.usuario._id;
      req.rol = req.usuario.rol;
      
      console.log('✅ Usuario cargado:', req.usuarioId);
      console.log('✅ Rol cargado:', req.rol);

      return next();
    } catch (error) {
      console.error('❌ Error en checkAuth:', error.message);
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }
  }

  console.log('❌ No hay token en los headers');
  if (!token) {
    return res.status(401).json({ msg: "No autorizado - Sin token" });
  }
};

export default checkAuth;