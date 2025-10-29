import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { soapAlumnoService } from "../soap/alumno.service.js";

const router = express.Router();

// Protect all alumno routes
router.use(authMiddleware);

// Obtener todos los alumnos
router.get("/", async (req, res) => {
    const soapResponse = await soapAlumnoService.getAlumnos(req.body);

    res.json(JSON.parse(soapResponse.response));
});

// Lista los alumnos de un curso + su asistencia en la fecha dada (LEFT JOIN)
router.get("/curso/:id_curso", async (req, res) => {
    const { id_curso } = req.params;
    const { fecha } = req.query;

    const soapResponse = await soapAlumnoService.obtenerAlumnosCursoPorFecha({ id_curso, fecha });

    res.json(JSON.parse(soapResponse.response));
});

export default router;