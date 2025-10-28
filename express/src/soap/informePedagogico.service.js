import { InformePedagogico, AsesorPedagogico, MateriasCurso, Materia, Curso, CiclosLectivos, Docente, Usuario, Alumno, DocentesMateriasCurso } from "../models/index.js";
import { Op } from "sequelize";

export const soapInformePedagogicoService = {
    async obtenerInformesPedagogicos(args) {
        try{
            const informeWhereClause = {};
            const materiasCursoWhereClause = {};

            if(args && args.id_alumno) informeWhereClause.id_alumno = args.id_alumno;
            
            if(args && args.id_curso) materiasCursoWhereClause.id_curso = args.id_curso;
            if(args && args.id_materia) materiasCursoWhereClause.id_materia = args.id_materia;

            const informes = await InformePedagogico.findAll({
                include: [
                    {
                        model: AsesorPedagogico,
                        as: "asesorPedagogico",
                        attributes: ['id_asesor'],
                        include: [
                            {
                                model: Usuario,
                                as: "usuario",
                                attributes: ['nombre', 'apellido']
                            }
                        ]
                    },
                    {
                        model: MateriasCurso,
                        as: "materiaCurso",
                        attributes: ['id_materia_curso'],
                        include: [
                            {
                                model: Materia,
                                as: "materia",
                                attributes: ['nombre']
                            },
                            {
                                model: Curso,
                                as: "curso",
                                attributes: ['anio_escolar', 'division', 'id_curso'],
                                include: [
                                    {
                                        model: CiclosLectivos,
                                        as: "cicloLectivo",
                                        attributes: ['anio']
                                    }
                                ]
                            }
                        ],
                        where: materiasCursoWhereClause
                    },
                    {
                        model: Docente,
                        as: "docente",
                        include: [
                            {
                                model: Usuario,
                                as: "usuario",
                                attributes: ['nombre', 'apellido']
                            }
                        ]
                    },
                    {
                        model: Alumno,
                        as: "alumno",
                        include: [
                            {
                                model: Usuario,
                                as: "usuario",
                                attributes: ['nombre', 'apellido']
                            }
                        ]
                    }
                ],
                where: informeWhereClause,
                order: [['fecha', 'DESC']]
            })

            return { response: JSON.stringify(informes) };
        }catch(error){
            console.error("Error al obtener los informes pedagógicos:", error);
            return { response: "Error obteniendo los informes pedagógicos" };
        }
    },
    async crearInformePedagogico(args) {
        try{
            let idAsesor = null;
            const user = args.usuario;
            const { id_alumno, id_curso, id_materia, id_asesor, contenido } = args;

            if(user.rol === 'Asesor Pedagogico'){
                const asesor = await AsesorPedagogico.findOne({
                    where: { id_usuario: user.id_usuario }
                });
                idAsesor = asesor.id_asesor;
            }else{
                idAsesor = id_asesor;
            }

            if(!idAsesor) throw new Error("El asesor pedagógico es obligatorio para crear un informe.");

            const materiaCurso = await MateriasCurso.findOne({
                where: {
                    id_curso: id_curso,
                    id_materia: id_materia
                }
            });

            const docentes = await DocentesMateriasCurso.findAll({
                where: {
                    id_materia_curso: materiaCurso.id_materia_curso,
                    fecha_fin: {
                        [Op.is]: null
                    },
                    rol_docente: {
                        [Op.in]: ['Titular', 'Suplente']
                    }
                },
                order: [['fecha_inicio', 'DESC']]
            });

            if(docentes.length === 0) throw new Error("No hay docentes activos asignados a la materia y curso especificados.");

            const nuevoInforme = await InformePedagogico.create({
                id_alumno: id_alumno,
                id_asesor: idAsesor,
                id_materia_curso: materiaCurso.id_materia_curso,
                id_docente: docentes[0].id_docente,
                contenido: contenido,
                fecha: new Date()
            });
            return { response: JSON.stringify(nuevoInforme) };
        }catch(error){
            console.error("Error al crear el informe pedagógico:", error);
            return { response: "Error creando el informe pedagógico" };
        }
    }
};