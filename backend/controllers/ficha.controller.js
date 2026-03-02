import { generarFicha } from "../services/ficha.service.js";

export const descargarFicha = async (req, res) => {
    try {
        const buffer = await generarFicha(req.params.id);

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=ficha.docx"
        );

        res.send(buffer);

    } catch (error) {
        res.status(500).json({ msg: "Error generando ficha", error });
    }
};