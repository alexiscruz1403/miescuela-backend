import { Router } from "express";
import { soapCiclosLectivosService } from "../soap/cicloLectivo.service.js";
import { validateCreateCiclo, validateUpdateCiclo, validateIdCiclo } from "../middlewares/validators/cicloLectivo.validator.js";

const router = Router();

// GET list (paginado opcional) => { data, total }
router.get("/", async(req, res) => {
    const { page, perPage, anio, estado } = req.query;

    const response = await soapCiclosLectivosService.getCiclos({ page, perPage, anio, estado });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// GET uno por id
router.get("/:id_ciclo", validateIdCiclo, async(req, res) => {
    const { id_ciclo } = req.params;

    const response = await soapCiclosLectivosService.getCiclo({ id_ciclo });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// POST crear
router.post("/", validateCreateCiclo, async (req, res) => {
    const response = await soapCiclosLectivosService.createCiclo(req.body);
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// PUT actualizar
router.put("/:id_ciclo", validateIdCiclo, validateUpdateCiclo, async (req, res) => {
    const { id_ciclo } = req.params;
    const response = await soapCiclosLectivosService.updateCiclo(id_ciclo, req.body);
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

// DELETE eliminar
router.delete("/:id_ciclo", validateIdCiclo, async (req, res) => {
    const { id_ciclo } = req.params;
    const response = await soapCiclosLectivosService.deleteCiclo(id_ciclo);
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;
