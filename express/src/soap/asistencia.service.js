import { Asistencia, Alumno, Curso, Usuario, AsistenciaEstado } from "../models/index.js";
import { Op } from "sequelize";

export const soapAsistenciaService = {
    async tomarAsistenciaCurso(args) {
        const { id_curso, fecha, items, usuario } = args;

        // Validación básica
        if (!id_curso || !fecha || !items) return { response: "Datos inválidos: id_curso, fecha e items son requeridos" };

        // Normalizamos items para que siempre sea un arreglo de objetos
        let itemsArray = [];
        if (Array.isArray(items.item)) {
            itemsArray = items.item;
        } else if (items.item) {
            itemsArray = [items.item]; // si solo vino un item
        } else if(Array.isArray(items)) {
            itemsArray = items;
        } else {
            return { response: { error: "No hay items para procesar" } };
        }

        try {
            const registros = itemsArray.map((i) => ({
                id_alumno: i.id_alumno,
                fecha,
                id_estado: i.id_estado,
                observaciones: i.observaciones || null,
                registrado_por: usuario?.id_usuario || null,
            }));

            await Asistencia.bulkCreate(registros, {
                updateOnDuplicate: ["id_estado", "observaciones", "registrado_por", "actualizado_el"],
            });

            return { response: JSON.stringify({ ok: true, total: registros.length }) };
        } catch (err) {
            console.error("Error registrando asistencia:", err);
            return { response: "Error registrando asistencia" };
        }
    },
    async obtenerAsistenciasCursoFecha(args) {
        const { id_curso, fecha } = args;
        const fechaConsulta = fecha || new Date().toISOString().split("T")[0];

        try {
            const asistencias = await Asistencia.findAll({
                include: [
                    {
                        model: Alumno,
                        where: { id_curso },
                        include: [
                        { model: Curso, attributes: ["anio_escolar", "division"], as: 'curso' },
                        { model: Usuario, attributes: ["nombre", "apellido"], as: 'usuario' },
                        ],
                    },
                    { model: AsistenciaEstado, attributes: ["descripcion"] },
                ],
                where: { fecha: fechaConsulta },
            });

            const data = asistencias.map((a) => ({
                id_asistencia: a.id_asistencia,
                fecha: a.fecha,
                id_estado: a.id_estado,
                estado_nombre: a.AsistenciaEstado?.descripcion,
                alumno_id: a.Alumno?.id_alumno,
                alumno_nombre: `${a.Alumno?.usuario?.apellido || ""} ${a.Alumno?.usuario?.nombre || ""}`.trim(),
                alumno_apellido: a.Alumno?.usuario?.apellido,
                alumno_nombre_prop: a.Alumno?.usuario?.nombre,
                curso_anio: a.Alumno?.curso?.anio_escolar,
                curso_division: a.Alumno?.curso?.division,
            }));

            return { response: JSON.stringify(data) };
        } catch (err) {
        console.error(err);
        return { response: "Error obteniendo asistencias del curso" };
        }
    },
    async obtenerAsistenciasCursoEntreFechas(args) {
        const { id_curso, desde, hasta } = args;

        // Validación básica
        if (!id_curso || !desde || !hasta) return { response: "Datos inválidos: id_curso, desde y hasta son requeridos" };

        try {
            const asistencias = await Asistencia.findAll({
                include: [
                    {
                        model: Alumno,
                        where: { id_curso },
                        include: [
                        { model: Curso, attributes: ["anio_escolar", "division"], as: "curso" },
                        { model: Usuario, attributes: ["nombre", "apellido"], as: "usuario" },
                        ],
                    },
                    { model: AsistenciaEstado, attributes: ["descripcion"] },
                ],
                where: { fecha: { [Op.between]: [desde, hasta] } },
            });

        // Formateamos la respuesta como objeto compatible con SOAP
        const data = asistencias.map((a) => ({
            id_asistencia: a.id_asistencia,
            fecha: a.fecha,
            id_estado: a.id_estado,
            estado_nombre: a.AsistenciaEstado?.descripcion,
            alumno_id: a.Alumno?.id_alumno,
            alumno_nombre: `${a.Alumno?.usuario?.apellido || ""} ${a.Alumno?.usuario?.nombre || ""}`.trim(),
            alumno_apellido: a.Alumno?.usuario?.apellido,
            alumno_nombre_prop: a.Alumno?.usuario?.nombre,
            curso_anio: a.Alumno?.curso?.anio_escolar,
            curso_division: a.Alumno?.curso?.division,
        }));

            return { response: JSON.stringify(data) };
        } catch (err) {
            console.error("Error obteniendo asistencias entre fechas:", err);
            return { response: "Error obteniendo asistencias del curso entre fechas" };
        }
    },
    async obtenerAsistenciasAlumnoEntreFechas(args) {
        const { id_alumno, desde, hasta } = args;

        // Validación básica
        if (!id_alumno || !desde || !hasta) return { response: JSON.stringify({ error: "Datos inválidos: id_alumno, desde y hasta son requeridos" }) };

        try {
            const asistencias = await Asistencia.findAll({
                include: [
                {
                    model: Alumno,
                    where: { id_alumno },
                    include: [
                    { model: Curso, attributes: ["anio_escolar", "division"], as: "curso" },
                    { model: Usuario, attributes: ["nombre", "apellido"], as: "usuario" },
                    ],
                },
                { model: AsistenciaEstado, attributes: ["descripcion"] },
                ],
                where: { fecha: { [Op.between]: [desde, hasta] } },
            });

            const data = asistencias.map((a) => ({
                id_asistencia: a.id_asistencia,
                fecha: a.fecha,
                id_estado: a.id_estado,
                estado_nombre: a.AsistenciaEstado?.descripcion,
                alumno_id: a.Alumno?.id_alumno,
                alumno_nombre: `${a.Alumno?.usuario?.apellido || ""} ${a.Alumno?.usuario?.nombre || ""}`.trim(),
                alumno_apellido: a.Alumno?.usuario?.apellido,
                alumno_nombre_prop: a.Alumno?.usuario?.nombre,
                curso_anio: a.Alumno?.curso?.anio_escolar,
                curso_division: a.Alumno?.curso?.division,
            }));

        return { response: JSON.stringify(data) };
        } catch (err) {
            console.error("Error obteniendo asistencias del alumno entre fechas:", err);
            return { response: JSON.stringify({ error: "Error obteniendo asistencias del alumno entre fechas" }) };
        }
    },
    async eliminarAsistenciasCurso(args) {
        const { id_curso, fecha } = args;

        if (!id_curso || !fecha) return { response: JSON.stringify({ error: "Datos inválidos: id_curso y fecha son requeridos" }) };

        try {
            const alumnos = await Alumno.findAll({
                where: { id_curso },
                attributes: ["id_alumno"],
            });

            if (!alumnos.length) return { response: JSON.stringify({ error: "No hay alumnos en este curso" }) };

            const idsAlumnos = alumnos.map((a) => a.id_alumno);

            const eliminados = await Asistencia.destroy({
                where: {
                    id_alumno: idsAlumnos,
                    fecha,
                },
            });

            return { response: JSON.stringify({ ok: true, eliminados }) };
        } catch (err) {
            console.error("Error eliminando asistencias del curso:", err);
            return { response: JSON.stringify({ error: "Error eliminando asistencias del curso" }) };
        }
    },
    async obtenerPromedioAsistenciasCurso(args) {
        try {
            const { id_curso, desde, hasta } = args;

            if (!id_curso || !desde || !hasta) return { response: JSON.stringify({ error: "Faltan parámetros: id_curso, desde o hasta" }) };

            const asistencias = await Asistencia.findAll({
                include: [
                    {
                        model: Alumno,
                        where: { id_curso },
                        include: [
                            { model: Curso, attributes: ["anio_escolar", "division"], as: "curso" },
                            { model: Usuario, attributes: ["nombre", "apellido"], as: "usuario" },
                        ],
                    },
                    { model: AsistenciaEstado, attributes: ["descripcion"] },
                ],
                where: { fecha: { [Op.between]: [desde, hasta] } },
            });

            const plainAsistencias = asistencias.map((a) => a.get({ plain: true }));

            const asistenciaPorAlumno = {};

            plainAsistencias.forEach((a) => {
                const id = a.Alumno?.id_alumno;
                if (!id) return;

                if (!asistenciaPorAlumno[id]) {
                asistenciaPorAlumno[id] = {
                    id_alumno: id,
                    nombre: a.Alumno?.usuario?.nombre || "",
                    apellido: a.Alumno?.usuario?.apellido || "",
                    total: 0,
                    presentes: 0,
                };
                }

                asistenciaPorAlumno[id].total += 1;
                if (a.AsistenciaEstado?.descripcion === "Presente") {
                asistenciaPorAlumno[id].presentes += 1;
                }
            });

            const resultados = Object.values(asistenciaPorAlumno).map((alumno) => ({
                id_alumno: alumno.id_alumno,
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                promedio:
                alumno.total > 0
                    ? Number(((alumno.presentes / alumno.total) * 100).toFixed(2))
                    : 0,
            }));

            return { response: JSON.stringify(resultados) };
        } catch (error) {
            console.error("Error obteniendo promedio de asistencias:", error);
            return { response: JSON.stringify({ error: "Error obteniendo el promedio de asistencias del curso" }) };
        }
    },
};
