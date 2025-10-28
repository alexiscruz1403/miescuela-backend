import express from "express";
import { soapAsistenciaEstadoService } from "../soap/asistenciaEstado.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all asistencia-estado routes
router.use(authMiddleware);

// GET /api/asistencia-estados
router.get("/", async (req, res) => {
    const response = await soapAsistenciaEstadoService.obtenerEstados({});
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;