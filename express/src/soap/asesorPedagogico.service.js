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

            return { response: JSON.stringify(asesores) };
        } catch (error) {
        console.error("Error obteniendo asesores pedagógicos SOAP:", error);
        return { response: "Error interno al obtener asesores pedagógicos" };
        }
    }
};
