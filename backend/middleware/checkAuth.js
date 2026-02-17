import jwt from "jsonwebtoken";
import Usuario from "../models/usuarios/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;

  // 🔹 1. Verificar si viene Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 🔹 2. Extraer token
      token = req.headers.authorization.split(" ")[1];

      // 🔹 3. Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔹 4. Buscar usuario y traer su rol
      req.usuario = await Usuario.findById(decoded.id)
        .select("-password")
        .populate("rol");

      return next();
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido" });
    }
  }

  // 🔹 5. Si no hay token
  if (!token) {
    return res.status(401).json({ msg: "No autorizado" });
  }
};

export default checkAuth;
