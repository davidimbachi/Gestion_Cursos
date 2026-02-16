  import express from "express";
  const router = express.Router();

  import {  registrar,
    confirmarEmail,
    olvidePassword,
    nuevoPassword,
    autenticar,} from "../controllers/usuarioController.js";

  // import checkAuth from "../middleware/checkAuth.js";

  // Crear usuario
  router.post("/", registrar);

  // Login
  router.post("/login", autenticar);

  // Confirmar emial 
  router.get("/confirmar/:token", confirmarEmail);

  // Recuperar password
 router.post("/olvide-password", olvidePassword);
router.post("/olvide-password/:token", nuevoPassword);

  // Perfil protegido
  // router.get("/perfil", checkAuth, perfil);

  export default router;