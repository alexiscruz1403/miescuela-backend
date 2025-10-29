import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getConteosCicloActual } from "../controllers/estadisticas.controller.js";

const router = express.Router();

// Proteger las rutas de estadísticas
router.use(authMiddleware);

// GET /api/estadisticas/conteos
// Retorna: { alumnos: number, docentes: number, cursos: number }
router.get("/conteos", getConteosCicloActual);

export default router;

