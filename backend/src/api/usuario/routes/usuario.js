'use strict';

/**
 * modulo router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/usuarios',
            handler: 'usuario.find'
        },
        {
            method: 'GET',
            path: '/usuarios/me',
            handler: 'usuario.me',
        },
        {
            method: 'POST',
            path: '/usuarios',
            handler: 'usuario.create'
        },
        {
            method: 'PUT',
            path: '/usuarios/:id',
            handler: 'usuario.update'
        },
        {
            method: 'DELETE',
            path: '/usuarios/:id',
            handler: 'usuario.delete'
        }
    ]
}