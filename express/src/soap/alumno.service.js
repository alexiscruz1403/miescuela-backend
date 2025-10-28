// /soap/alumno.service.js
import { Alumno, Usuario, Asistencia, Curso } from "../models/index.js";
import { Op } from "sequelize";

export const soapAlumnoService = {
    async getAlumnos(args) {
        console.log("SOAP getAlumnos called with args:", args);
        try {
            const id_curso = args.id_curso;
            const whereClause = {};
            if (id_curso) whereClause.id_curso = id_curso;
        
            const alumnos = await Alumno.findAll({
                where: whereClause,
                include: [
                    {
                        model: Usuario,
                        attributes: ["nombre", "apellido"],
                        as: 'usuario'
                    },
                    {
                        model: Curso,
                        attributes: ['id_curso', 'anio_escolar', 'division'],
                        as: 'curso'
                    }
                ],
                attributes: ["id_alumno"],
                order: [[{ model: Usuario, as: 'usuario' }, 'apellido', 'ASC'], [{ model: Usuario, as: 'usuario' }, 'nombre', 'ASC']]
            });

            return { response: JSON.stringify(alumnos) }; // SOAP solo entiende strings
        } catch (error) {
            console.error("SOAP getAlumnos error:", error);
            return { response: "Error obteniendo alumnos" };
        }
    },

    async obtenerAlumnosCursoPorFecha(args) {
        const { id_curso, fecha } = args;

        if (!id_curso || !fecha) return { response: "id_curso y fecha son requeridos" };

        try {
            const alumnos = await Alumno.findAll({
                where: { id_curso },
                include: [
                {
                    model: Usuario,
                    attributes: ["nombre", "apellido"],
                    as: "usuario",
                },
                {
                    model: Asistencia,
                    required: false,
                    where: { fecha: { [Op.eq]: fecha } },
                    attributes: ["id_estado"],
                },
                ],
                order: [
                    [{ model: Usuario, as: "usuario" }, "nombre", "ASC"],
                    [{ model: Usuario, as: "usuario" }, "apellido", "ASC"],
                ],
            });

            const data = alumnos.map((a) => ({
                id_alumno: a.id_alumno,
                alumno_nombre: `${a.usuario?.apellido || ""} ${a.usuario?.nombre || ""}`.trim(),
                alumno_apellido: a.usuario?.apellido,
                alumno_nombre_prop: a.usuario?.nombre,
                id_estado: a.Asistencia?.[0]?.id_estado || null,
            }));

            return { response: JSON.stringify(data) };
        } catch (error) {
            console.error("SOAP obtenerAlumnosCursoPorFecha error:", error);
            return { response: "Error obteniendo alumnos del curso/fecha" };
        }
    },
};
