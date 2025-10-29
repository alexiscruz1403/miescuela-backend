import {
    Alumno,
    Docente,
    Usuario,
    Curso,
    Materia,
    Calificacion,
    MateriasCurso,
    TipoCalificacion,
    CiclosLectivos,
} from "../models/index.js";
import { Op } from "sequelize";

export const soapCalificacionesService = {
    async getCalificaciones(args) {
        try {
            const { id_curso, id_materia, id_alumno } = args;
            const user = args.usuario;

            const materiasWhereClause = { id_curso };
            if (id_materia) materiasWhereClause.id_materia = id_materia;

            const alumnosWhereClause = {};
            if (id_alumno) alumnosWhereClause.id_alumno = id_alumno;

            const cicloActual = new Date().getFullYear();

            const includeBase = [
                {
                    model: MateriasCurso,
                    as: "materiaCurso",
                    where: materiasWhereClause,
                    include: [
                        { model: Materia, as: "materia", attributes: ["nombre"] },
                        {
                            model: Curso,
                            as: "curso",
                            attributes: ["anio_escolar", "division"],
                            include: [{ model: CiclosLectivos, as: "cicloLectivo", attributes: ["anio"] }],
                        },
                        { model: Docente, as: "docentes", attributes: ["id_docente"] },
                    ],
                },
                {
                    model: Alumno,
                    as: "alumno",
                    include: [{ model: Usuario, as: "usuario", attributes: ["apellido", "nombre"] }],
                },
                {
                    model: Docente,
                    as: "docente",
                    include: [{ model: Usuario, as: "usuario", attributes: ["apellido", "nombre"] }],
                },
                { model: TipoCalificacion, as: "tipoCalificacion", attributes: ["descripcion"] },
            ];

            let whereClause = alumnosWhereClause;

            if (user.rol === "Docente") {
                whereClause = {
                    ...alumnosWhereClause,
                    "$materiaCurso.docentes.id_usuario$": user.id_usuario,
                    "$materiaCurso.curso.cicloLectivo.anio$": cicloActual.toString(),
                };
            }

            const calificaciones = await Calificacion.findAll({
                include: includeBase,
                where: whereClause,
                order: [
                    [{ model: Alumno, as: "alumno" }, { model: Usuario, as: "usuario" }, "apellido", "ASC"],
                    [{ model: Alumno, as: "alumno" }, { model: Usuario, as: "usuario" }, "nombre", "ASC"],
                    ["fecha", "ASC"],
                ],
            });

            return { response: JSON.stringify(calificaciones) };
        } catch (error) {
        console.error(error);
            throw { Fault: { faultcode: "Server", faultstring: "Error obteniendo calificaciones" } };
        }
    },

  // Obtener calificaciones por alumno
    async getCalificacionesPorAlumno(args) {
        try {
            const { id_alumno } = args;
            const calificaciones = await Calificacion.findAll({
                include: [
                    {
                        model: Alumno,
                        as: "alumno",
                        include: [{ model: Usuario, as: "usuario", attributes: ["nombre", "apellido"] }],
                    },
                    {
                        model: MateriasCurso,
                        as: "materiaCurso",
                        include: [
                            { model: Materia, as: "materia", attributes: ["nombre"] },
                            {
                                model: Curso,
                                as: "curso",
                                attributes: ["anio_escolar", "division"],
                                include: [{ model: CiclosLectivos, as: "cicloLectivo", attributes: ["anio"] }],
                            },
                        ],
                    },
                    { model: TipoCalificacion, as: "tipoCalificacion", attributes: ["descripcion"] },
                ],
                where: { id_alumno },
            });

            return { response: JSON.stringify(calificaciones) };
        } catch (error) {
            console.error(error);
            throw { Fault: { faultcode: "Server", faultstring: "Error obteniendo calificaciones del alumno" } };
        }
    },

  // Obtener tipos de calificación
    async getTiposCalificacion() {
        try {
            const tipos = await TipoCalificacion.findAll();
            return { response: JSON.stringify(tipos) };
        } catch (error) {
            console.error(error);
            throw { Fault: { faultcode: "Server", faultstring: "Error obteniendo tipos de calificación" } };
        }
    },

    // Crear muchas calificaciones
    async createManyCalificaciones(args) {
        try {
            const { usuario } = args;

            const calificaciones = Array.isArray(args.calificaciones.item)
                ? args.calificaciones.item
                : [args.calificaciones.item];

            const mappedCalificaciones = calificaciones.map((calificacion) => ({
                id_alumno: parseInt(calificacion.id_alumno),
                id_curso: parseInt(calificacion.id_curso),
                id_materia: parseInt(calificacion.id_materia),
                id_docente: calificacion.id_docente ? parseInt(calificacion.id_docente) : null,
                id_tipo_calificacion: parseInt(calificacion.id_tipo_calificacion),
                nota: parseFloat(calificacion.nota),
                observaciones: calificacion.observaciones,
            }));

            let idDocente = null;

            if (usuario.rol !== "Docente") idDocente = mappedCalificaciones[0].id_docente;
            if (usuario.rol === "Docente") {
                const docente = await Docente.findOne({
                    where: { id_usuario: usuario.id_usuario },
                    attributes: ["id_docente"],
                });
                idDocente = docente?.id_docente;
            }

            if (!idDocente) throw new Error("No se pudo determinar el docente para crear las calificaciones.");

            const createPromises = calificaciones.map(async (calificacion) => {
                const materiaCurso = await MateriasCurso.findOne({
                    where: {
                        id_curso: calificacion.id_curso,
                        id_materia: calificacion.id_materia
                    }
                });

                return Calificacion.create({
                    id_alumno: calificacion.id_alumno,
                    id_docente: idDocente,
                    id_materia_curso: materiaCurso.id_materia_curso,
                    id_tipo_calificacion: calificacion.id_tipo_calificacion,
                    ciclo_lectivo: new Date().getFullYear(),
                    nota: parseFloat(calificacion.nota),
                    observaciones: calificacion.observaciones,
                    fecha: new Date()
                });
            });
            await Promise.all(createPromises);

            return { response: "Calificaciones agregadas correctamente" };
        } catch (error) {
            console.error(error);
            return { response: JSON.stringify({ error: "Error creando calificaciones" }) };
        }
    },

    // Actualizar muchas calificaciones
    async updateManyCalificaciones(args) {
        try {
            const { usuario } = args;

            const calificaciones = Array.isArray(args.calificaciones.item)
                ? args.calificaciones.item
                : [args.calificaciones.item];

            let idDocente = null;

            if (usuario.rol !== "Docente") idDocente = calificaciones[0].id_docente;
            if (usuario.rol === "Docente") {
                const docente = await Docente.findOne({
                    where: { id_usuario: usuario.id_usuario },
                    attributes: ["id_docente"],
                });
                idDocente = docente?.id_docente;
            }

            if (!idDocente) throw new Error("No se pudo determinar el docente para actualizar las calificaciones.");

            const mappedCalificaciones = calificaciones.map(calificacion => ({
                id_calificacion: parseInt(calificacion.id_calificacion),
                nota: parseFloat(calificacion.nota),
                observaciones: calificacion.observaciones,
                id_tipo_calificacion: parseInt(calificacion.id_tipo_calificacion),
            }));

            const updatePromises = mappedCalificaciones.map((calificacion) => {
                const { id_calificacion, ...updateData } = calificacion;
                return Calificacion.update(
                    {
                        nota: parseFloat(updateData.nota),
                        observaciones: updateData.observaciones,
                        id_tipo_calificacion: updateData.id_tipo_calificacion,
                        id_docente: idDocente,
                        fecha: new Date(),
                    },
                    { where: { id_calificacion } }
                );
            });

            const result = await Promise.all(updatePromises);
            return { response: "Calificaciones actualizadas correctamente" };
        } catch (error) {
            console.error(error);
            return { response: JSON.stringify({ error: "Error actualizando calificaciones" }) };
        }
    },
};
