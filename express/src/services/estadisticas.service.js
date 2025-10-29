import { Op } from "sequelize";
import {
  Alumno,
  Curso,
  Docente,
  MateriasCurso,
  CiclosLectivos,
  sequelize,
} from "../models/index.js";

// Intenta obtener el ciclo actual, priorizando estado 'Abierto';
// si no hay, usa el año calendario; si tampoco, toma el último por fecha_inicio.
const findCicloActual = async () => {
  let ciclo = await CiclosLectivos.findOne({
    where: { estado: { [Op.iLike]: "Abierto" } },
    order: [["fecha_inicio", "DESC"]],
  });

  if (!ciclo) {
    const anio = new Date().getFullYear();
    ciclo = await CiclosLectivos.findOne({ where: { anio } });
  }

  if (!ciclo) {
    ciclo = await CiclosLectivos.findOne({ order: [["fecha_inicio", "DESC"]] });
  }

  return ciclo;
};

export const getConteosCicloActual = async () => {
  const ciclo = await findCicloActual();

  if (!ciclo) {
    return { alumnos: 0, docentes: 0, cursos: 0 };
  }

  // Cursos del ciclo
  const cursos = await Curso.count({ where: { id_ciclo: ciclo.id_ciclo } });

  // Alumnos: conteo simple de la tabla 'alumnos' (sin cruces ni filtros por ciclo)
  const alumnos = await Alumno.count();

  // Docentes activos asignados a materias de cursos del ciclo
  const docentes = await Docente.count({
    distinct: true,
    col: "id_docente",
    include: [
      {
        model: MateriasCurso,
        as: "materiasCurso",
        required: true,
        attributes: [],
        through: {
          attributes: [],
          where: {
            [Op.and]: [
              { fecha_inicio: { [Op.lte]: sequelize.fn("NOW") } },
              {
                [Op.or]: [
                  { fecha_fin: { [Op.gte]: sequelize.fn("NOW") } },
                  { fecha_fin: null },
                ],
              },
            ],
          },
        },
        include: [
          {
            model: Curso,
            as: "curso",
            required: true,
            attributes: [],
            where: { id_ciclo: ciclo.id_ciclo },
          },
        ],
      },
    ],
  });

  return { alumnos, docentes, cursos };
};
