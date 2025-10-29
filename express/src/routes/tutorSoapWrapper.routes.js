import { id } from "zod/v4/locales";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isTutor } from "../middlewares/isTutor.middleware.js";
import { soapTutorService } from "../soap/tutor.service.js";
import { Router } from 'express';

const router = Router();

// Protect all tutor routes
router.use(authMiddleware);

router.get('/hijos', isTutor, async (req, res) => {
    const response = await soapTutorService.obtenerHijos({ idTutor: req.tutor.id_tutor });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;