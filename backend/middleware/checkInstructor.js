const checkInstructor = (req, res, next) => {
  if (!req.usuario || String(req.usuario.rol._id) !== "699341afcf355992981fed0d") {
    return res.status(403).json({ msg: "Acceso denegado: solo instructores pueden crear o modificar ofertas" });
  }
  next();
};

export default checkInstructor;