import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import Oferta from "../models/ofertas/oferta/oferta.js";

export const generarFicha = async (ofertaId, instructorId) => {

    const oferta = await Oferta.findById(ofertaId)
        .populate("empresa_solicitante");

    if (!oferta) throw new Error("Oferta no encontrada");

    const templatePath = path.join(
        process.cwd(),
        "templates/word/ficha_de_caracterizacion_base.docx"
    );

    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    doc.setData({
        codigo_programa: oferta.codigo_programa,
        nombre_programa: oferta.nombre_programa,
        version_programa: oferta.version_programa,
        duracion_programa: oferta.duracion,
        fecha_inicio: oferta.fecha_inicio,
        fecha_fin: oferta.fecha_fin,
        cupo: oferta.cupo,
        modalidad: oferta.modalidad_oferta,
        departamento: oferta.departamento,
        municipio: oferta.municipio,
        direccion: oferta.direccion,
        nombre_responsable: oferta.nombre_responsable,
        numero_identificacion: oferta.numero_identificacion,
        email: oferta.email,
        empresa: oferta.empresa_solicitante?.nombre,
        subsector: oferta.subsector,
        programa_especial: oferta.programa_especial,
        convenio: oferta.empresa_solicitante?.cual_convenio,
        fecha_inscripcion: oferta.fecha_creacion
    });

    doc.render();

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    // Ruta relativa (esto es lo que guardaremos en BD)
    const relativePath = path.join(
        "ofertas",
        instructorId.toString(),
        oferta._id.toString(),
        "ficha.docx"
    );

    // Ruta absoluta (esto es lo que usa el sistema para guardar)
    const absolutePath = path.join(
        process.cwd(),
        "uploads",
        relativePath
    );

    const dir = path.dirname(absolutePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, buffer);

    // Devolvemos solo la ruta relativa
    return relativePath;
};
