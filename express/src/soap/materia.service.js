import { Materia, Curso, MateriasCurso, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const soapMateriaService = {
    async obtenerMaterias(args){
        try{
            const { page = 1, perPage = 10, nombre, descripcion } = args;
            const limit = parseInt(perPage);
            const offset = (parseInt(page) - 1) * limit;

            const where = {};
            if (nombre) where.nombre = { [Op.iLike]: `%${nombre}%` };
            if (descripcion) where.descripcion = { [Op.iLike]: `%${descripcion}%` };

            const { rows, count } = await Materia.findAndCountAll({
                where,
                limit,
                offset,
                order: [["nombre", "ASC"]],
            });

            return { response: JSON.stringify({ data: rows, total: count }) };
        }catch(error){
            console.error("Error en soapMateriaService.obtenerMaterias:", error);
            return { response: "Error al obtener materias" };
        }
    },
    async obtenerMateria(args){
        try{
            const { id_materia } = args;
            const materia = await Materia.findByPk(id_materia);

            return { response: JSON.stringify(materia) };
        }catch(error){
            console.error("Error en soapMateriaService.obtenerMateria:", error);
            return { response: "Error al obtener materia" };
        }
    },
    async crearMateria(args){
        try{
            const { nombre, descripcion } = args;
            const materia = await Materia.create({
                nombre: nombre,
                descripcion: descripcion ?? null,
            });

            return { response: JSON.stringify(materia) };
        }catch(error){
            console.error("Error en soapMateriaService.crearMateria:", error);
            return { response: "Error al crear materia" };
        }
    },
    async actualizarMateria(args){
        try{    
            const { id_materia, nombre, descripcion } = args;
            const materia = await Materia.findByPk(id_materia);

            if (!materia) return { response: "Error al obtener materia" };

            await materia.update({
                nombre: nombre ?? materia.nombre,
                descripcion: descripcion ?? materia.descripcion,
            });

            return { response: JSON.stringify(materia) };
        }catch(error){
            console.error("Error en soapMateriaService.actualizarMateria:", error);
            return { response: "Error al actualizar materia" };
        }
    },
    async eliminarMateria(args){
        try{
            const { id_materia } = args;

            const vinculos = await MateriasCurso.count({ where: { id_materia } });
            if (vinculos > 0) return { response: "No se puede eliminar: tiene cursos asociados" };

            await Materia.destroy({ where: { id_materia } });

            return { response: "Materia eliminada correctamente" };
        }catch(error){
            console.error("Error en soapMateriaService.eliminarMateria:", error);
            return { response: "Error al eliminar materia" };
        }
    },
    async asignarCursoAMateria(args){
        try{
            const { id_materia, id_curso } = args;
            const [rel] = await MateriasCurso.findOrCreate({
                where: { id_materia, id_curso },
                defaults: { id_materia, id_curso },
            });

            return { response: JSON.stringify(rel) };
        }catch(error){
            console.error("Error en soapMateriaService.asignarCursoAMateria:", error);
            return { response: "Error al asignar curso a materia" };
        }
    },
    async desasignarCursoDeMateria(args){
        try{
            const { id_materia, id_curso } = args;
            const deleted = await MateriasCurso.destroy({ where: { id_materia, id_curso } });
            return { response: "Curso desasignado correctamente" };
        }catch(error){
            console.error("Error en soapMateriaService.desasignarCursoDeMateria:", error);
            return { response: "Error al desasignar curso de materia" };
        }
    }
}