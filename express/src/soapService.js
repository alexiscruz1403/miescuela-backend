import { authMiddleware } from "./soap/middlewares/authMiddleware.js";
import { soapAlumnoService } from "./soap/alumno.service.js";
import { soapAuthService } from "./soap/auth.service.js";
import { soapAsesorPedagogicoService } from "./soap/asesorPedagogico.service.js";
import { soapAsistenciaService } from "./soap/asistencia.service.js";
import { soapAsistenciaEstadoService } from "./soap/asistenciaEstado.service.js";
import { soapCalificacionesService } from "./soap/calificaciones.service.js";
import { soapCiclosLectivosService } from "./soap/cicloLectivo.service.js";
import { soapCursoService } from "./soap/curso.service.js";
import { soapInformePedagogicoService } from "./soap/informePedagogico.service.js";
import { soapMateriaService } from "./soap/materia.service.js";
import { soapRolService } from "./soap/rol.service.js";
import { soapTutorService } from "./soap/tutor.service.js";
import { soapUsuarioService } from "./soap/usuario.service.js";

export const soapService = {
    MiEscuelaService: {
        MiEscuelaPort: {
            async rootMessage(args, cb, headers) {
                return { resultado: "Bienvenido al servicio SOAP de MiEscuela 4.0" };
            },

            // Métodos de autenticación
            async login(args) {
                return soapAuthService.login(args);
            },
            async refresh(args) {
                return soapAuthService.refresh(args);
            },
            async logout(args) {
                return soapAuthService.logout(args);
            },

            // Métodos de alumno
            obtenerAlumnos: authMiddleware(async function obtenerAlumnos(args, cb, headers) {   
                return soapAlumnoService.getAlumnos(args);
            }),
            obtenerAlumnosCursoPorFecha: authMiddleware(async function obtenerAlumnosCursoPorFecha(args, cb, headers) {
                return soapAlumnoService.obtenerAlumnosCursoPorFecha(args);
            }),

            // Métodos de asesor pedagógico
            obtenerAsesoresPedagogicos: authMiddleware(async function getAsesoresPedagogicos(args, cb, headers) {
                return soapAsesorPedagogicoService.getAsesoresPedagogicos(args);
            }),

            // Métodos de asistencia
            tomarAsistenciaCurso: authMiddleware(async function(args) {
                return soapAsistenciaService.tomarAsistenciaCurso(args);
            }),
            obtenerAsistenciaCursoFecha: authMiddleware(async function(args) {
                return soapAsistenciaService.obtenerAsistenciasCursoFecha(args);
            }),
            obtenerAsistenciasCursoEntreFechas: authMiddleware(async function(args) {
                return soapAsistenciaService.obtenerAsistenciasCursoEntreFechas(args);
            }),
            obtenerAsistenciasAlumnoEntreFechas: authMiddleware(async function(args) {
                return soapAsistenciaService.obtenerAsistenciasAlumnoEntreFechas(args);
            }),
            eliminarAsistenciasCurso: authMiddleware(async function(args) {
                return soapAsistenciaService.eliminarAsistenciasCurso(args);
            }),
            obtenerPromedioAsistenciasCurso: authMiddleware(async function(args) {
                return soapAsistenciaService.obtenerPromedioAsistenciasCurso(args);
            }),

            // Métodos de estado de asistencia
            obtenerEstados: authMiddleware(async function(args) {
                return soapAsistenciaEstadoService.obtenerEstados(args);
            }),

            // Métodos de calificaciones
            obtenerCalificaciones: authMiddleware(async function(args) {
                return soapCalificacionesService.getCalificaciones(args);
            }),
            obtenerCalificacionesPorAlumno: authMiddleware(async function(args) {
                return soapCalificacionesService.getCalificacionesPorAlumno(args);
            }),
            obtenerTiposCalificacion: authMiddleware(async function(args) {
                return soapCalificacionesService.getTiposCalificacion(args);
            }),
            crearCalificaciones: authMiddleware(async function(args) {
                return soapCalificacionesService.createManyCalificaciones(args);
            }),
            actualizarCalificaciones: authMiddleware(async function(args) {
                return soapCalificacionesService.updateManyCalificaciones(args);
            }),

            // Métodos de ciclos lectivos
            obtenerCiclos: authMiddleware(async function(args) {
                return soapCiclosLectivosService.getCiclos(args);
            }),
            obtenerCiclo: authMiddleware(async function(args) {
                return soapCiclosLectivosService.getCiclo(args);
            }),
            crearCiclo: authMiddleware(async function(args) {
                return soapCiclosLectivosService.createCiclo(args);
            }),
            actualizarCiclo: authMiddleware(async function(args) {
                return soapCiclosLectivosService.updateCiclo(args);
            }),
            eliminarCiclo: authMiddleware(async function(args) {
                return soapCiclosLectivosService.deleteCiclo(args);
            }),

            // Métodos de cursos
            obtenerCursos: authMiddleware(async function(args) {
                return soapCursoService.obtenerCursos(args);
            }),
            obtenerCursosRestringido: authMiddleware(async function(args) {
                return soapCursoService.obtenerCursosRestringido(args);
            }),
            obtenerCurso: authMiddleware(async function(args) {
                return soapCursoService.obtenerCurso(args);
            }),
            crearCurso: authMiddleware(async function(args) {
                return soapCursoService.crearCurso(args);
            }),
            actualizarCurso: authMiddleware(async function(args) {
                return soapCursoService.actualizarCurso(args);
            }),
            eliminarCurso: authMiddleware(async function(args) {
                return soapCursoService.eliminarCurso(args);
            }),
            obtenerMateriasPorCurso: authMiddleware(async function(args) {
                return soapCursoService.obtenerMateriasPorCurso(args);
            }),
            obtenerAlumnosPorCurso: authMiddleware(async function(args) {
                return soapCursoService.obtenerAlumnosPorCurso(args);
            }),
            obtenerDocentesPorCurso: authMiddleware(async function(args) {
                return soapCursoService.obtenerDocentesPorCurso(args);
            }),

            //Métodos de informes pedagógicos
            obtenerInformesPedagogicos: authMiddleware(async function(args) {
                return soapInformePedagogicoService.obtenerInformesPedagogicos(args);
            }),
            crearInformePedagogico: authMiddleware(async function(args) {
                return soapInformePedagogicoService.crearInformePedagogico(args);
            }),

            // Métodos de materias
            obtenerMaterias: authMiddleware(async function(args) {
                return soapMateriaService.obtenerMaterias(args);
            }),
            obtenerMateria: authMiddleware(async function(args) {
                return soapMateriaService.obtenerMateria(args);
            }),
            crearMateria: authMiddleware(async function(args) {
                return soapMateriaService.crearMateria(args);
            }),
            actualizarMateria: authMiddleware(async function(args) {
                return soapMateriaService.actualizarMateria(args);
            }),
            eliminarMateria: authMiddleware(async function(args) {
                return soapMateriaService.eliminarMateria(args);
            }),
            asignarCursoAMateria: authMiddleware(async function(args) {
                return soapMateriaService.asignarCursoAMateria(args);
            }),
            desasignarCursoDeMateria: authMiddleware(async function(args) {
                return soapMateriaService.desasignarCursoDeMateria(args);
            }),

            // Métodos de roles
            obtenerRoles: authMiddleware(async function(args) {
                return soapRolService.obtenerRoles(args);
            }),

            // Métodos de tutores
            obtenerHijos: authMiddleware(async function(args) {
                return soapTutorService.obtenerHijos(args);
            }),

            // Métodos de usuarios
            obtenerUsuarios: authMiddleware(async function(args) {
                return soapUsuarioService.obtenerUsuarios(args);
            }),
            obtenerUsuariosConRol: authMiddleware(async function(args) {
                return soapUsuarioService.obtenerUsuariosConRol(args);
            }),
            obtenerUsuariosSinRol: authMiddleware(async function(args) {
                return soapUsuarioService.obtenerUsuariosSinRol(args);
            }),
            obtenerUsuario: authMiddleware(async function(args) {
                return soapUsuarioService.obtenerUsuario(args);
            }),
            crearUsuario: authMiddleware(async function(args) {
                return soapUsuarioService.crearUsuario(args);
            }),
            actualizarUsuario: authMiddleware(async function(args) {
                return soapUsuarioService.actualizarUsuario(args);
            }),
            eliminarUsuario: authMiddleware(async function(args) {
                return soapUsuarioService.eliminarUsuario(args);
            }),
            asignarRolAUsuario: authMiddleware(async function(args) {
                return soapUsuarioService.asignarRolAUsuario(args);
            }),
            desasignarRolDeUsuario: authMiddleware(async function(args) {
                return soapUsuarioService.desasignarRolDeUsuario(args);
            }),
        },
    },
};