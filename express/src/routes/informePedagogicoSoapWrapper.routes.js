import { Router } from "express";
import { soapInformePedagogicoService } from "../soap/informePedagogico.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    const response = await soapInformePedagogicoService.obtenerInformesPedagogicos(req.query);

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.post("/", async (req, res) => {
    const response = await soapInformePedagogicoService.crearInformePedagogico({ usuario: req.usuario,...req.body});

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;