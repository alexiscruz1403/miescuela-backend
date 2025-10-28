import { CiclosLectivos } from "../models/CiclosLectivos.js";
import { Op } from "sequelize";

const toDateOnly = (value) => {
    if (!value) return null;
    try {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
    } catch {
        return null;
    }
};

const mapCiclo = (c) => ({
    id_ciclo: c.id_ciclo,
    anio: c.anio,
    fecha_inicio: toDateOnly(c.fecha_inicio) || c.fecha_inicio,
    fecha_fin: toDateOnly(c.fecha_fin) || c.fecha_fin,
    estado: c.estado,
});

export const soapCiclosLectivosService = {
    async getCiclos(args) {
        try{
            const { page = 1, perPage = 10, anio, estado } = args;
            const limit = parseInt(perPage);
            const offset = (parseInt(page) - 1) * limit;

            const where = {};
            if (anio) where.anio = parseInt(anio);
            if (estado) where.estado = { [Op.iLike]: `%${estado}%` };

            const { rows, count } = await CiclosLectivos.findAndCountAll({
                where,
                limit,
                offset,
                order: [["anio", "DESC"]],
            });

            const mapped = rows.map(mapCiclo);

            return { response: JSON.stringify({ data: mapped, total: count }) };
        }catch(error){
            console.error("Error en getCiclos SOAP:", error);
            return { response: JSON.stringify({ error: "Error interno al obtener ciclos lectivos" }) };
        }
    },

    async getCiclo(args) {
        try{
            const { id_ciclo } = args;
            const ciclo = await CiclosLectivos.findByPk(id_ciclo);
            const mapped = ciclo ? mapCiclo(ciclo) : null;
            return { response: JSON.stringify(mapped) };
        }catch(error){
            console.error("Error en getCiclo SOAP:", error);
            return { response: JSON.stringify({ error: "Error interno al obtener ciclo lectivo" }) };
        }
    },

    async createCiclo(args) {
        try{
            const { anio, fecha_inicio, fecha_fin, estado } = args;
            const ciclo = await CiclosLectivos.create({
                anio,
                fecha_inicio,
                fecha_fin,
                estado,
            });
            const mapped = mapCiclo(ciclo);
            return { response: JSON.stringify(mapped) };
        }catch(error){
            console.error("Error en createCiclo SOAP:", error);
            return { response: JSON.stringify({ error: "Error interno al crear ciclo lectivo" }) };
        }
    },

    async updateCiclo(args) {
        try{
            const { id_ciclo, anio, fecha_inicio, fecha_fin, estado } = args;
            const ciclo = await CiclosLectivos.findByPk(id_ciclo);
            if (!ciclo) return { response: JSON.stringify(null) };
            await ciclo.update({
                anio: anio ?? ciclo.anio,
                fecha_inicio: fecha_inicio ?? ciclo.fecha_inicio,
                fecha_fin: fecha_fin ?? ciclo.fecha_fin,
                estado: estado ?? ciclo.estado,
            });
            const mapped = mapCiclo(ciclo);
            return { response: JSON.stringify(mapped) };
        }catch(error){
            console.error("Error en updateCiclo SOAP:", error);
            return { response: JSON.stringify({ error: "Error interno al actualizar ciclo lectivo" }) };
        }
    },

    async deleteCiclo(args) {
        try{
            const { id_ciclo } = args;
            const deleted = await CiclosLectivos.destroy({ where: { id_ciclo } });
            return { response: JSON.stringify({ deleted }) };
        }catch(error){
            console.error("Error en deleteCiclo SOAP:", error);
            return { response: JSON.stringify({ error: "Error interno al eliminar ciclo lectivo" }) };
        }
    }
};
