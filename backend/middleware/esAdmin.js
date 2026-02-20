const esAdmin = (req, res, next) => {
  if (req.usuario.rol.nombre !== "Administrador") {
    return res.status(403).json({ msg: "Acceso denegado" });
  }
  next();
};

export default esAdmin;
