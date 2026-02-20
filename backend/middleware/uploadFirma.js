import multer from "multer";
import path from "path";

// Configuración almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/firmas");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro para aceptar solo PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const uploadFirma = multer({
  storage,
  fileFilter,
});

export default uploadFirma;