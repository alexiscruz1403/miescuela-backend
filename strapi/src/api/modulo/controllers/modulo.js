'use strict';

/**
 * modulo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::modulo.modulo',({ strapi }) => ({
    async find(ctx) {
        const user = ctx.state.user; // viene del JWT
        if (!user) return ctx.unauthorized("No autenticado");

        const rolName = user.role?.name;
        if (!rolName) return ctx.forbidden("No tienes rol asignado");

        const customRole = await strapi.db.query("api::rol-usuario.rol-usuario").findOne({
            where: { nombre_rol: rolName },
        });

        if (!customRole) {
            return ctx.notFound(
                `No se encontró un rol personalizado con nombre: ${customRole?.nombre_rol}`
            );
        }

        const modulos = await strapi.db.query("api::modulo.modulo").findMany({
            where: { rol_usuarios: customRole.id }
        });

        return { data: modulos };
    },
}));
