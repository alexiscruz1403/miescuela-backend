'use strict';

/**
 * asistencia controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::asistencia.asistencia', ({ strapi }) => ({
    async create(ctx) {
        try {
        const { id_alumno, curso, estado } = ctx.request.body;

        // 1. Buscar el alumno por nombre + curso
        const alumno = await strapi.db.query("api::alumno.alumno").findOne({
            where: {
                id: id_alumno,
                curso: {
                    id: curso,
                },
            },
            populate: {
                usuario: true,
                curso: true,
            },
        });

        if (!alumno) {
            return ctx.badRequest("No se encontró el alumno con ese curso");
        }

        // 2. Buscar el estado (Presente, Ausente, etc.)
        const estadoEntity = await strapi.db.query("api::asistencia-estado.asistencia-estado").findOne({
            where: { descripcion: estado },
        });

        if (!estadoEntity) {
            return ctx.badRequest("No se encontró el estado");
        }

        // 4. Crear asistencia
        const nuevaAsistencia = await strapi.entityService.create("api::asistencia.asistencia", {
            data: {
                alumno: alumno.documentId,
                estado: estadoEntity.id,
            },
            populate: {
                alumno: {
                    populate: {
                        user: true,
                        curso: true,
                    },
                },
                estado: true,
            },
        });

        return nuevaAsistencia;
        } catch (error) {
            console.error(error);
            return ctx.internalServerError("Error al crear asistencia");
        }
    },
    async update(ctx){
        try{
            const { id } = ctx.params;
            const { estado } = ctx.request.body;

            // Buscar el estado (Presente, Ausente, etc.)
            const estadoEntity = await strapi.db.query("api::asistencia-estado.asistencia-estado").findOne({
                where: { descripcion: estado },
            });

            if (!estadoEntity) {
                return ctx.badRequest("No se encontró el estado");
            }

            const updatedAsistencia = await strapi.entityService.update("api::asistencia.asistencia", id, 
            {
                data: {
                    estado: estadoEntity.id,
                },
                populate: {
                    alumno: {
                        populate: {
                            user: true,
                            curso: true,
                        },
                    },
                    estado: true,
                },
            });

            console.log(updatedAsistencia.documentId);
            //await strapi.entityService.publish("api::asistencia.asistencia", id);
            await strapi.documents("api::asistencia.asistencia").publish({
                documentId: updatedAsistencia.documentId
            })

            return updatedAsistencia;
        }catch(error){
            console.error(error);
            return ctx.internalServerError("Error al actualizar asistencia");
        }
    }
}));
