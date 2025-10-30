// routes/asistencia.routes.js
import express, { response } from "express";
import { soapAsistenciaService } from "../soap/asistencia.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all asistencia routes
router.use(authMiddleware);

// Registro en lote
router.post("/curso", async (req, res) => {
    
    const response = await soapAsistenciaService.tomarAsistenciaCurso(req.body);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// Consultas
router.get("/curso/:id_curso/recientes", async (req, res) => {
    const { id_curso } = req.params;
    const { fecha } = req.query;

    const response = await soapAsistenciaService.obtenerAsistenciasCursoFecha({ id_curso, fecha });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.get("/curso/:id_curso", async (req, res) => {
    const { id_curso } = req.params;
    const { desde, hasta } = req.query;

    const response = await soapAsistenciaService.obtenerAsistenciasCursoEntreFechas({ id_curso, desde, hasta });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.get("/alumno/:id_alumno", async (req, res) => {
    const { id_alumno } = req.params;
    const { desde, hasta } = req.query;

    const response = await soapAsistenciaService.obtenerAsistenciasAlumnoEntreFechas({ id_alumno, desde, hasta });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.delete("/curso/:id_curso", async (req, res) => {
    const { id_curso } = req.params;
    const { fecha } = req.query;

    const response = await soapAsistenciaService.eliminarAsistenciasCurso({ id_curso, fecha });
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.get("/curso/:id_curso/promedio", async (req, res) => {
    const { id_curso } = req.params;
    const { desde, hasta } = req.query;

    const response = await soapAsistenciaService.obtenerPromedioAsistenciasCurso({ id_curso, desde, hasta });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;