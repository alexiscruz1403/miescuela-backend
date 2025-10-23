'use strict';

const { pop } = require('../../../../config/middlewares');

/**
 * usuario controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = {
    async find(ctx) {
        const auth = ctx.state.user;
        if(!auth) return ctx.unauthorized("No estás autenticado");

        // Parámetros de paginación desde query params
        const { page = 1, pageSize = 25 } = ctx.query;

        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        // Contar total de usuarios
        const total = await strapi.db.query("plugin::users-permissions.user").count();

        const users = await strapi.db.query("plugin::users-permissions.user").findMany({
            select: ['id', 'username', 'email', 'numero_documento', 'legajo'],
            populate: { role: { select: ['id', 'name'] } },
            limit,
            offset,
        });
        
        return {
            data: users,
            meta: {
                pagination: {
                    page: parseInt(page),
                    pageSize: limit,
                    pageCount: Math.ceil(total / limit),
                    total,
                },
            },
        };
    },
    async me(ctx){
        const auth = ctx.state.user;
        if(!auth) return ctx.unauthorized("No estás autenticado");

        const userDetails = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: auth.id },
            select: ['id', 'username', 'email', 'numero_documento', 'legajo'],
            populate: { role: { select: ['id', 'name'] } },
        });
        return userDetails;
    },
    async create(ctx) {
        try {
            const auth = ctx.state.user;
            if(!auth) return ctx.unauthorized("No estás autenticado");

            const { username, email, password, numero_documento, legajo, role_name } = ctx.request.body;

            // Buscar rol por nombre en la tabla de roles del plugin
            const role = await strapi.db.query("plugin::users-permissions.role").findOne({
                where: { name: role_name },
            });

            if (!role) {
                return ctx.badRequest("Rol no encontrado");
            }

            // Crear usuario en users-permissions
            const newUser = await strapi.db.query("plugin::users-permissions.user").create({
                data: {
                    username,
                    email,
                    password,
                    numero_documento,
                    legajo,
                    role: role.id,
                },
                populate: { role: true }
            });

            // Si el rol es Alumno → crear registro en tu colección Alumno
            if (role.name === "Alumno") {
                await strapi.entityService.create("api::alumno.alumno", {
                    data: {
                        user: newUser.id,
                        curso: null,
                    },
                });
            }

            return {
                data: newUser
            }
        } catch (err) {
            console.error(err);
            return ctx.internalServerError("Error al crear usuario");
        }
    },

    async update(ctx) {
        try {
            const auth = ctx.state.user;
            if(!auth) return ctx.unauthorized("No estás autenticado");

            const { id } = ctx.params;
            const { username, email, numero_documento, legajo, role_name } = ctx.request.body;

            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { id: parseInt(id, 10) },
            });

            if (!user) return ctx.notFound("Usuario no encontrado");

            let role = null;
            if (role_name) {
                role = await strapi.db.query("plugin::users-permissions.role").findOne({
                    where: { name: role_name },
                });
                if (!role) return ctx.badRequest("Rol no encontrado");
            }

            // Actualizar datos del usuario
            const updatedUser = await strapi.db.query("plugin::users-permissions.user").update({
                where: { id: parseInt(id, 10) },
                data: {
                    username: username ?? user.username,
                    email: email ?? user.email,
                    numero_documento: numero_documento ?? user.numero_documento,
                    legajo: legajo ?? user.legajo,
                    role: role ? role.id : user.role,
                },
                populate: { role: true }
            });

            // Si el nuevo rol es Alumno → asegurarse de que exista un registro en Alumno
            if (role?.name === "Alumno") {
                const alumno = await strapi.db.query("api::alumno.alumno").findOne({
                    where: { user: updatedUser.id },
                });

                if (!alumno) {
                    await strapi.entityService.create("api::alumno.alumno", {
                        data: {
                            user: updatedUser.id,
                            curso: null,
                        },
                    });
                }
            }else{
                const alumno = await strapi.db.query("api::alumno.alumno").findOne({
                    where: { user: updatedUser.id },
                });

                if (alumno) {
                    console.log("Eliminando alumno asociado al usuario");
                    await strapi.db.query("api::alumno.alumno").delete({
                        where: { user: updatedUser.id },
                    });
                }
            }

            return {
                data: updatedUser
            };
        } catch (err) {
            console.error(err);
            return ctx.internalServerError("Error al actualizar usuario");
        }
    },

    async delete(ctx) {
        try {
            const auth = ctx.state.user;
            if(!auth) return ctx.unauthorized("No estás autenticado");

            const { id } = ctx.params;

            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where: { id: parseInt(id, 10) },
            });

            if (!user) return ctx.notFound("Usuario no encontrado");

            await strapi.db.query("plugin::users-permissions.user").delete({
                where: { id: parseInt(id, 10) },
            });

            if (user.role?.name === "Alumno") {
                const alumno = await strapi.db.query("api::alumno.alumno").findOne({
                    where: { usuario: user.id },
                });

                if (!alumno) {
                    await strapi.db.query("api::alumno.alumno").delete({
                        where: { usuario: user.id },
                    });
                }
            }

            return { message: "Usuario eliminado correctamente" };
        } catch (err) {
            console.error(err);
            return ctx.internalServerError("Error al eliminar usuario");
        }
    },
};