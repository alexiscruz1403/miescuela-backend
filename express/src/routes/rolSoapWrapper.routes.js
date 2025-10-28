import { Router } from 'express';
import { soapRolService } from '../soap/rol.service.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all rol routes
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        const { id } = req.query;
        const response = await soapRolService.obtenerRoles({ id });
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;