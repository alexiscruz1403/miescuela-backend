import { Rol } from '../models/Rol.js';

export const soapRolService = {
    async obtenerRoles(args){
        try{
            const whereClause = {};
            if(args.id) whereClause.id_rol = args.id;

            const roles = await Rol.findAll({
                attributes: ['id_rol', 'nombre_rol'],
                where: {
                    ...whereClause
                }
            });
            return { response: JSON.stringify(roles) };
        }catch(error){
            console.error("Error en obtenerRoles:", error);
            return { response: "Error al obtener roles" };
        }
    }
}