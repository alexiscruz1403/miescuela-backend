// routes/curso.routes.js
import express from "express";
import { soapCursoService } from "../soap/curso.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all curso routes
router.use(authMiddleware);

// GET /api/cursos
router.get("/", async (req, res) => {
    const response = await soapCursoService.obtenerCursos({});

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

router.get("/restricted", async (req, res) => {
    const response = await soapCursoService.obtenerCursosRestringido(req);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// GET /api/cursos/:id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const response = await soapCursoService.obtenerCurso({ id });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// GET /api/cursos/:id/materias
router.get("/:id/materias", async (req, res) => {
    const { id } = req.params;
    const response = await soapCursoService.obtenerMateriasPorCurso({ id_curso: id, usuario: req.usuario });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// GET /api/cursos/:id/alumnos
router.get("/:id/alumnos", async (req, res) => {
    const { id } = req.params;
    const response = await soapCursoService.obtenerAlumnosPorCurso({ id_curso: id });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// GET /api/cursos/:id/docentes
router.get("/:id/docentes", async (req, res) => {
    const { id } = req.params;
    const response = await soapCursoService.obtenerDocentesPorCurso({ id_curso: id });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// POST /api/cursos
router.post("/", async (req, res) => {
    const response = await soapCursoService.crearCurso(req.body);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// PUT /api/cursos/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const cursoData = req.body;
    const response = await soapCursoService.actualizarCurso({ id, ...cursoData });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// PUT /api/cursos/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const cursoData = req.body;
    const response = await soapCursoService.actualizarCurso({ id, ...cursoData });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// DELETE /api/cursos/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const response = await soapCursoService.eliminarCurso({ id });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;