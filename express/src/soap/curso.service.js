import { Materia, Curso, Alumno, Usuario, Docente, MateriasCurso, AlumnosCursos, CiclosLectivos, sequelize} from "../models/index.js";
import { Op } from "sequelize";

export const soapCursoService = {
    async obtenerCursos(args) {
        try{
            const cursos = await Curso.findAll({
                attributes: ["id_curso", "anio_escolar", "division"],
                order: [["anio_escolar", "ASC"], ["division", "ASC"]],
            });
            return { response: JSON.stringify(cursos) };
        }catch(error){
            console.error("Error obteniendo cursos SOAP:", error);
            return { response: "Error obteniendo cursos" };
        }
    },
    async obtenerCursosRestringido(args){
        try{
            const user = args.usuario;

            if(user.rol === "Administrador" || user.rol === "Director" || user.rol === "Asesor Pedagogico"){
                const cursos = await Curso.findAll({
                    attributes: [
                        [sequelize.fn('MAX', sequelize.col('id_curso')), 'id_curso'],
                        'anio_escolar',
                        'division'
                    ],
                    group: ['anio_escolar', 'division'],
                    order: [['anio_escolar', 'ASC'], ['division', 'ASC']],
                });
                return { response: JSON.stringify(cursos) };
            }
            
            if(user.rol === "Docente"){
                const cicloActual = new Date().getFullYear();

                const docente = await Docente.findOne({
                    where: { id_usuario: user.id_usuario },
                    attributes: ['id_docente']
                });

                const cursos = await Curso.findAll({
                    where: { 
                        '$cicloLectivo.anio$': cicloActual.toString(),
                        '$materiasCurso.docentes.id_docente$': docente.id_docente
                    },
                    include: [
                        {
                            model: MateriasCurso,
                            as: 'materiasCurso',
                            include: [
                                {
                                    model: Docente,
                                    as: 'docentes',
                                    attributes: []
                                }
                            ],
                            attributes: []
                        },
                        {
                            model: CiclosLectivos,
                            as: 'cicloLectivo',
                            attributes: []
                        }
                    ],
                    attributes: [
                        'id_curso',
                        'anio_escolar',
                        'division',
                    ],
                    order: [
                        ['anio_escolar', 'ASC'],
                        ['division', 'ASC']
                    ],
                });
                return { response: JSON.stringify(cursos) };
            }
            return { response: JSON.stringify([]) };
        }catch(error){
            console.error("Error obteniendo cursos restringidos SOAP:", error);
            return { response: "Error obteniendo cursos" };
        }
    },
    async obtenerCurso(args){
        try{
            const curso = await Curso.findOne({
                where: { id_curso: args.id_curso },
                attributes: ["id_curso", "anio_escolar", "division"],
            });
            return { response: JSON.stringify(curso) };
        }catch(error){
            console.error("Error obteniendo curso SOAP:", error);
            return { response: "Error obteniendo curso" };
        }
    },
    async crearCurso(args){
        try{
            const { anio_escolar, division, id_ciclo} = args;
            const nuevoCurso = await Curso.create({
                anio_escolar,
                division,
                id_ciclo
            });
            return { response: JSON.stringify(nuevoCurso) };
        }catch(error){
            console.error("Error creando curso SOAP:", error);
            return { response: "Error creando curso" };
        }
    },
    async actualizarCurso(args){
        try{
            const curso = await Curso.findByPk(args.id_curso);
            if (!curso) return { response: "Curso no encontrado" };
            await curso.update({
                anio_escolar: args.anio_escolar,
                division: args.division,
                id_ciclo: args.id_ciclo
            });
            return { response: JSON.stringify(curso) };
        }catch(error){
            console.error("Error actualizando curso SOAP:", error);
            return { response: "Error actualizando curso" };
        }
    },
    async eliminarCurso(args){
        try{
            const curso = await Curso.findByPk(args.id_curso);
            if (!curso) return { response: "Curso no encontrado" };
            await curso.destroy();
            return { response: JSON.stringify({ ok: true }) };
        }catch(error){
            console.error("Error eliminando curso SOAP:", error);
            return { response: "Error eliminando curso" };
        }
    },
    async obtenerMateriasPorCurso(args) {
        try{
            const user = args.usuario;
            const idCurso = args.id_curso;
            if(user.rol === "Administrador" || user.rol === "Director" || user.rol === "Asesor Pedagogico"){
                const materias = await Materia.findAll({
                    include: [
                        {
                            model: MateriasCurso,
                            as: 'materiasCurso',
                            include: [
                                {
                                    model: Curso,
                                    as: 'curso',
                                    attributes: []
                                }
                            ],
                            attributes: []
                        }
                    ],
                    attributes: [
                        'id_materia',
                        'nombre',
                    ],
                    where: sequelize.where(sequelize.col('materiasCurso.curso.id_curso'), idCurso),
                    order: [['nombre', 'ASC']]
                });

                return { response: JSON.stringify(materias) };
            }
            if(user.rol === "Docente"){
                const docente = await Docente.findOne({
                    where: { id_usuario: user.id_usuario },
                    attributes: ['id_docente']
                });
                const materias = await Materia.findAll({
                    include: [
                        {
                            model: MateriasCurso,
                            as: 'materiasCurso',
                            include: [
                                {
                                    model: Curso,
                                    as: 'curso',
                                    attributes: []
                                },
                                {
                                    model: Docente,
                                    as: 'docentes',
                                    attributes: []
                                }
                            ],
                            attributes: []
                        }
                    ],
                    attributes: [
                        'id_materia',
                        'nombre',
                    ],
                    where: {
                        '$materiasCurso.curso.id_curso$': idCurso,
                        '$materiasCurso.docentes.id_docente$': docente.id_docente,
                    },
                    order: [['nombre', 'ASC']]
                });

                return { response: JSON.stringify(materias) };
            }
        }catch(error){
            console.error("Error obteniendo materias por curso SOAP:", error);
            return { response: "Error obteniendo materias por curso" };
        }
    },
    async obtenerAlumnosPorCurso(args) {
        try{
            const idCurso = args.id_curso;
            const alumnos = await Alumno.findAll({
                include: [
                    {
                        model: Curso,
                        as: 'cursos',
                        where: { id_curso: idCurso },
                        attributes: []
                    },
                    {
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['apellido','nombre']
                    }
                ],
                attributes: ['id_alumno'],
                order: [[{ model: Usuario, as: 'usuario' }, 'apellido', 'ASC'], [{ model: Usuario, as: 'usuario' }, 'nombre', 'ASC']]
            });

            return { response: JSON.stringify(alumnos) };
        }catch(error){
            console.error("Error obteniendo alumnos por curso SOAP:", error);
            return { response: "Error obteniendo alumnos por curso" };
        }
    },
    async obtenerDocentesPorCurso(args) {
        try{
            const idCurso = args.id_curso;
            const docentes = await Docente.findAll({
                include: [
                    {
                        model: MateriasCurso,
                        as: 'materiasCurso',
                        where: { id_curso: idCurso },
                        through: {
                            attributes: ['fecha_inicio', 'fecha_fin'],
                            where: {
                                // Docentes activos actualmente
                                [Op.and]: [
                                    { fecha_inicio: { [Op.lte]: sequelize.fn('NOW') } },
                                    {
                                        [Op.or]: [
                                            { fecha_fin: { [Op.gte]: sequelize.fn('NOW') } },
                                            { fecha_fin: null } // sin fecha de fin => sigue activo
                                        ]
                                    }
                                ]
                            }
                        },
                        include: [
                            {
                                model: Curso,
                                as: 'curso',
                                attributes: []
                            },
                            {
                                model: Materia,
                                as: 'materia',
                                attributes: ['nombre', 'id_materia']
                            }
                        ]
                    },
                    {
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['apellido','nombre']
                    }
                ],
                attributes: ['id_docente'],
            });

            return { response: JSON.stringify(docentes) };
        }catch(error){
            console.error("Error obteniendo docentes por curso SOAP:", error);
            return { response: "Error obteniendo docentes por curso" };
        }
    }
};