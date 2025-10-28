import { Router } from 'express';
import { soapMateriaService } from '../soap/materia.service.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all materia routes
router.use(authMiddleware);

// Listado paginado (React-Admin compatible)
router.get('/', async (req, res) => {
    const { page, perPage, nombre, descripcion } = req.query;

    const response = await soapMateriaService.obtenerMaterias({
        page: page || 1,
        perPage: perPage || 10,
        nombre,
        descripcion
    });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// CRUD principal
router.get('/:id_materia', async (req, res) => {
    const { id_materia } = req.params;
    const response = await soapMateriaService.obtenerMateria({ id_materia });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// CRUD principal
router.get('/:id_materia', async (req, res) => {
    const { id_materia } = req.params;
    const response = await soapMateriaService.obtenerMateria({ id_materia });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.post('/', async (req, res) => {
    const response = await soapMateriaService.crearMateria(req.body);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.put('/:id_materia', async (req, res) => {
    const { id_materia } = req.params;
    const response = await soapMateriaService.actualizarMateria({ id_materia, ...req.body });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.patch('/:id_materia', async (req, res) => {
    const { id_materia } = req.params;
    const response = await soapMateriaService.actualizarMateria({ id_materia, ...req.body });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.delete('/:id_materia', async (req, res) => {
    const { id_materia } = req.params;
    const response = await soapMateriaService.eliminarMateria({ id_materia });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// Relaciones con cursos
router.post('/:id_materia/cursos/:id_curso', async (req, res) => {
    const { id_materia, id_curso } = req.params;
    const response = await soapMateriaService.asignarCursoAMateria({ id_materia, id_curso });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.delete('/:id_materia/cursos/:id_curso', async (req, res) => {
    const { id_materia, id_curso } = req.params;
    const response = await soapMateriaService.desasignarCursoDeMateria({ id_materia, id_curso });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;