import { Alumno, Tutor, Usuario, Curso } from "../models/index.js";

export const soapTutorService = {
    async obtenerHijos(args){
        try{
            const tutor = await Tutor.findOne({
                where: { id_usuario: args.usuario.id_usuario },
                include: [
                    {
                        model: Alumno,
                        as: 'alumnos',
                        attributes: ['id_alumno'],
                        include: [
                            { 
                                model: Usuario,
                                as: 'usuario',
                                attributes: ['nombre', 'apellido']
                            },
                            {
                                model: Curso,
                                as: 'curso',
                                attributes: ['id_curso', 'anio_escolar', 'division']
                            }
                        ]
                    }
                ],
                order: [
                    [{ model: Alumno, as: 'alumnos' }, { model: Usuario, as: 'usuario' }, 'apellido', 'ASC'],
                    [{ model: Alumno, as: 'alumnos' }, { model: Usuario, as: 'usuario' }, 'nombre', 'ASC'],
                ]
            });
            const response = tutor ? { response: JSON.stringify(tutor.alumnos) } : { response: JSON.stringify([]) };
            return response;
        }catch(error){
            console.error("Error en soapTutorService.obtenerHijos:", error);
            return { response: "Error al obtener los hijos del tutor." };
        }
    }
};