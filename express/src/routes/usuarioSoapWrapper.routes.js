import { Router } from 'express';
import { validateGetUsuarios, validateCreateUsuario, validateUpdateUsuario, validateDeleteUsuario, validateAssignRolUsuario, validateUnassignRolUsuario } from '../middlewares/validators/usuario.validator.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { soapUsuarioService } from '../soap/usuario.service.js';

const router = Router();

// Protect all usuario routes
router.use(authMiddleware);

router.get("/", validateGetUsuarios, async (req, res) => {
    const { page, perPage, numero_documento, id_rol } = req.query;
    const response = await soapUsuarioService.obtenerUsuarios({ page, perPage, numero_documento, id_rol });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){  
        res.json(response.response);
    }
});
router.get("/sin-rol", validateGetUsuarios, async (req, res) => {
    const { page, perPage, numero_documento, nombre, apellido, order, sort } = req.query;
    const response = await soapUsuarioService.obtenerUsuariosSinRol({ page, perPage, numero_documento, nombre, apellido, order, sort });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.get("/con-rol", validateGetUsuarios, async (req, res) => {
    const { page, perPage, numero_documento, nombre, apellido, id_rol, order, sort } = req.query;
    const response = await soapUsuarioService.obtenerUsuariosConRol({ page, perPage, numero_documento, nombre, apellido, id_rol, order, sort });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.get("/:id_usuario", async (req, res) => {
    const { id_usuario } = req.params;
    const response = await soapUsuarioService.obtenerUsuario({ id_usuario });
    
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.post("/", validateCreateUsuario, async (req, res) => {
    const response = await soapUsuarioService.crearUsuario(req.body);
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.put("/:id_usuario", validateUpdateUsuario, async (req, res) => {
    const { id_usuario } = req.params;

    const response = await soapUsuarioService.actualizarUsuario({ id_usuario, data: req.body });
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.put("/:id_usuario/rol", validateAssignRolUsuario, async (req, res) => {
    const { id_usuario } = req.params;
    const { id_rol } = req.body;
    const response = await soapUsuarioService.asignarRolAUsuario({ id_usuario, id_rol });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.delete("/:id_usuario/rol", validateUnassignRolUsuario, async (req, res) => {
    const { id_usuario } = req.params;
    const response = await soapUsuarioService.desasignarRolDeUsuario({ id_usuario });

    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});
router.delete("/:id_usuario", validateDeleteUsuario, async (req, res) => {
    const { id_usuario } = req.params;
    const response = await soapUsuarioService.eliminarUsuario({ id_usuario});
    
    try{
        res.json(JSON.parse(response.response));
    }catch(error){
        res.json(response.response);
    }
});

export default router;