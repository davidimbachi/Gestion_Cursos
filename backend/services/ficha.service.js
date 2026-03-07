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

export const generarCartaSolicitud = async (ofertaId, instructorId) => {
    const oferta = await Oferta.findById(ofertaId)
        .populate("usuario", "nombre email")
        .populate("empresa_solicitante")
        .populate({
            path: "programa",
            select: "codigo nombre version duracion",
            populate: [
                { path: "nivel_formacion", select: "nombre" },
                { path: "linea_tecnologica", select: "nombre" }
            ]
        });

    if (!oferta) throw new Error("Oferta no encontrada");

    const templatePath = path.join(
        process.cwd(),
        "templates/word/carta_solicitud_instructor_base.docx"
    );

    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    // Formatear fechas
    const fechaInicio = oferta.fecha_inicio ? new Date(oferta.fecha_inicio).toLocaleDateString('es-CO') : '';
    const fechaFin = oferta.fecha_fin ? new Date(oferta.fecha_fin).toLocaleDateString('es-CO') : '';
    const fechaActual = new Date().toLocaleDateString('es-CO');

    doc.setData({
        nombre_instructor: oferta.usuario?.nombre || '',
        email_instructor: oferta.usuario?.email || '',
        nombre_programa: oferta.programa?.nombre || '',
        codigo_programa: oferta.programa?.codigo || '',
        version_programa: oferta.programa?.version || '',
        duracion_programa: oferta.programa?.duracion || '',
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        cupo: oferta.cupo || 0,
        nombre_empresa: oferta.empresa_solicitante?.nombre || '',
        fecha_actual: fechaActual
    });

    doc.render();

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    // Ruta relativa
    const relativePath = path.join(
        "ofertas",
        instructorId.toString(),
        oferta._id.toString(),
        "carta_solicitud.docx"
    );

    // Ruta absoluta
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

    return relativePath;
};

export const generarMasivoAprendices = async (ofertaId, instructorId) => {
    // Por ahora, crear un archivo Excel básico con estructura para aprendices
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Aprendices');

    // Headers
    worksheet.columns = [
        { header: 'Tipo Documento', key: 'tipo_documento', width: 15 },
        { header: 'Número Documento', key: 'numero_documento', width: 20 },
        { header: 'Nombres', key: 'nombres', width: 25 },
        { header: 'Apellidos', key: 'apellidos', width: 25 },
        { header: 'Fecha Nacimiento', key: 'fecha_nacimiento', width: 15 },
        { header: 'Género', key: 'genero', width: 10 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Dirección', key: 'direccion', width: 30 },
        { header: 'Municipio', key: 'municipio', width: 20 },
        { header: 'EPS', key: 'eps', width: 20 },
        { header: 'ARL', key: 'arl', width: 20 }
    ];

    // Estilo de headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Ruta relativa
    const relativePath = path.join(
        "ofertas",
        instructorId.toString(),
        ofertaId.toString(),
        "masivo_aprendices.xlsx"
    );

    // Ruta absoluta
    const absolutePath = path.join(
        process.cwd(),
        "uploads",
        relativePath
    );

    const dir = path.dirname(absolutePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    await workbook.xlsx.writeFile(absolutePath);

    return relativePath;
};
