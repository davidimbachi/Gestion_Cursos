const esAdmin = (req, res, next) => {
  if (req.usuario.rol.nombre !== "Admin") {
    return res.status(403).json({ msg: "Acceso denegado" });
  }
  next();
};

export default esAdmin;
