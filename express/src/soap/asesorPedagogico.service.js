import { AsesorPedagogico, Usuario } from "../models/index.js";

export const soapAsesorPedagogicoService = {
    getAsesoresPedagogicos: async (args) => {
        try {
            const asesores = await AsesorPedagogico.findAll({
                include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ['nombre', 'apellido', 'email']
                }
                ]
            });

            const data = asesores.map(a => ({
                id_asesor: a.id_asesor,
                nombre: a.usuario?.nombre,
                apellido: a.usuario?.apellido,
                email: a.usuario?.email
            }));

            return { response: JSON.stringify(data) };
        } catch (error) {
        console.error("Error obteniendo asesores pedagógicos SOAP:", error);
        return { response: "Error interno al obtener asesores pedagógicos" };
        }
    }
};
