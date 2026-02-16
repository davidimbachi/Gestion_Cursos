// backend/middleware/checkAuth.js
import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded; // aquí guardamos info del usuario autenticado
      return next();
    } catch (error) {
      return res.status(401).json({ msg: "Token no válido" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso denegado" });
  }
};

export default checkAuth;