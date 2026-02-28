const esCoordinador = (req, res, next) => {
  console.log('🔍 [esCoordinador] Verificando rol de coordinador...');
  console.log('🔍 [esCoordinador] req.usuario:', req.usuario);
  console.log('🔍 [esCoordinador] req.usuario.rol:', req.usuario?.rol);
  
  if (!req.usuario) {
    console.log('❌ [esCoordinador] No hay usuario autenticado');
    return res.status(401).json({ msg: "No autorizado - Usuario no autenticado" });
  }
  
  if (!req.usuario.rol) {
    console.log('❌ [esCoordinador] Usuario sin rol');
    return res.status(403).json({ msg: "Acceso denegado - Usuario sin rol" });
  }
  
  // Verificar si el rol es Coordinador (por nombre o por ID)
  const rolNombre = req.usuario.rol.nombre;
  const esCoord = rolNombre === 'Coordinador';
  
  console.log('🔍 [esCoordinador] Rol del usuario:', rolNombre);
  console.log('🔍 [esCoordinador] ¿Es coordinador?', esCoord);
  
  if (!esCoord) {
    console.log('❌ [esCoordinador] ACCESO DENEGADO - No es coordinador');
    return res.status(403).json({ msg: "Acceso denegado - Se requiere rol de Coordinador" });
  }
  
  console.log('✅ [esCoordinador] Acceso permitido - Coordinador verificado');
  next();
};

export default esCoordinador;