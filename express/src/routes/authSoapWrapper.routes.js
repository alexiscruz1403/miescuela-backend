import { Router } from 'express';
import { validateLogin, validateRefreshToken } from '../middlewares/validators/auth.validator.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { soapAuthService } from '../soap/auth.service.js';

const router = Router();

router.post('/login', validateLogin, async (req, res) => {
    const soapResponse = await soapAuthService.login(req.body);

    try{
        res.json(JSON.parse(soapResponse.response));
    }catch(error){
        res.json(soapResponse);
    }
});
router.post('/refresh', validateRefreshToken, async (req, res) => {
    const soapResponse = await soapAuthService.refresh(req.body);

    try{
        res.json(JSON.parse(soapResponse.response));
    }catch(error){
        res.json(soapResponse);
    }
});
router.post('/logout', authMiddleware, async (req, res) => {
    const soapResponse = await soapAuthService.logout(req.body);
    res.json(JSON.parse(soapResponse.response));
});

export default router;