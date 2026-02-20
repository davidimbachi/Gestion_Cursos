const checkInstructor = (req, res, next) => {
  console.log('🔍 [checkInstructor] Verificando permisos...');
  console.log('🔍 [checkInstructor] req.usuario:', req.usuario);
  console.log('🔍 [checkInstructor] req.usuario.rol:', req.usuario?.rol);
  console.log('🔍 [checkInstructor] req.usuario.rol._id:', req.usuario?.rol?._id);
  console.log('🔍 [checkInstructor] Tipo de _id:', typeof req.usuario?.rol?._id);
  
  if (!req.usuario) {
    console.log('❌ [checkInstructor] No hay usuario');
    return res.status(403).json({ msg: "Acceso denegado: no hay usuario autenticado" });
  }
  
  if (!req.usuario.rol) {
    console.log('❌ [checkInstructor] El usuario no tiene rol');
    return res.status(403).json({ msg: "Acceso denegado: usuario sin rol asignado" });
  }
  
  const rolId = String(req.usuario.rol._id);
  const rolEsperado = "699341afcf355992981fed0d";
  
  console.log('🔍 [checkInstructor] ID del rol actual:', rolId);
  console.log('🔍 [checkInstructor] ID del rol esperado:', rolEsperado);
  console.log('🔍 [checkInstructor] ¿Son iguales?', rolId === rolEsperado);
  console.log('🔍 [checkInstructor] Longitud ID actual:', rolId.length);
  console.log('🔍 [checkInstructor] Longitud ID esperado:', rolEsperado.length);
  
  if (rolId !== rolEsperado) {
    console.log('❌ [checkInstructor] ACCESO DENEGADO - IDs diferentes');
    return res.status(403).json({ msg: "Acceso denegado: solo instructores pueden crear o modificar ofertas" });
  }
  
  console.log('✅ [checkInstructor] Acceso permitido');
  next();
};

export default checkInstructor;