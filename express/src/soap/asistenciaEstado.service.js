import { AsistenciaEstado } from "../models/index.js";

export const soapAsistenciaEstadoService = {
    async obtenerEstados(args) {
        try {
            const estados = await AsistenciaEstado.findAll();

            const data = estados.map((estado) => ({
                id_estado: estado.id_estado,
                descripcion: estado.descripcion,
            }));

            return { response: JSON.stringify(data) };
        } catch (error) {
            console.error("Error al obtener estados de asistencia:", error);
            return {
                response: JSON.stringify({
                    error: "Error al obtener estados de asistencia",
                    detalle: error.message,
                }),
            };
        }
    },
};
