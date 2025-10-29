import { Router } from "express";
import { soapAsesorPedagogicoService } from "../soap/asesorPedagogico.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    const response = await soapAsesorPedagogicoService.getAsesoresPedagogicos({});

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;