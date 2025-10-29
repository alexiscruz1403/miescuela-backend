import { Router } from 'express';
import { soapCalificacionesService } from '../soap/calificaciones.service.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all calificacion routes
router.use(authMiddleware);

router.get('/', async (req, res) => {
    const response = await soapCalificacionesService.getCalificaciones(req.query);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){  
        res.json(response.response);
    }
});
router.get('/tipos', async (req, res) => {
    const response = await soapCalificacionesService.getTiposCalificacion();

    try{
        res.json(JSON.parse(response.response));
    }catch(error){  
        res.json(response.response);
    }
});
router.get('/alumno/:id', async (req, res) => {
    const args = { id_alumno: req.params.id };
    const response = await soapCalificacionesService.getCalificacionesPorAlumno(args);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){  
        res.json(response.response);
    }
});
router.put('/', async (req, res) => {
    const response = await soapCalificacionesService.updateManyCalificaciones(req.body);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){  
        res.json(response.response);
    }
});
router.post('/', async (req, res) => {
    const response = await soapCalificacionesService.createManyCalificaciones(req.body);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){  
        res.json(response.response);
    }
});

export default router;