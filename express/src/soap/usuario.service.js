import { Usuario, Rol, UsuarioRol, Administrador, Director, Docente, Auxiliar, AsesorPedagogico, Alumno, Tutor } from '../models/index.js'; // Asegura que las asociaciones se configuren
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

const createUserInRoleTable = async (roleId, userId, transaction) => {
    console.log("Creating user in role table:", { roleId, userId });
    switch(roleId){
        case 1: // Admin
            await Administrador.create({ id_usuario: userId }, { transaction });
            break;
        case 2: // Director
            await Director.create({ id_usuario: userId }, { transaction });
            break;
        case 3: // Docente
            await Docente.create({ id_usuario: userId }, { transaction });
            break;
        case 4: // Auxiliar
            await Auxiliar.create({ id_usuario: userId }, { transaction });
            break;
        case 5: // Asesor Pedagógico
            await AsesorPedagogico.create({ id_usuario: userId }, { transaction });
            break;
        case 6: // Alumno
            await Alumno.create({ id_usuario: userId }, { transaction });
            break;
        case 7: // Tutor
            await Tutor.create({ id_usuario: userId }, { transaction });
            break;
    }
}

const deleteUserInRoleTable = async (oldRole, userId, transaction) => {
    console.log("Deleting user in role table:", { oldRole, userId });
    switch(oldRole){
        case 1: // Admin
            await Administrador.destroy({ where: { id_usuario: userId }, transaction });
            break;
        case 2: // Director
            await Director.destroy({ where: { id_usuario: userId }, transaction });
            break;
        case 3: // Docente
            await Docente.destroy({ where: { id_usuario: userId }, transaction });
            break;
        case 4: // Auxiliar
            await Auxiliar.destroy({ where: { id_usuario: userId }, transaction });
            break;
        case 5: // Asesor Pedagógico
            await AsesorPedagogico.destroy({ where: { id_usuario: userId }, transaction });
            break;
        case 6: // Alumno
            await Alumno.destroy({ where: { id_usuario: userId }, transaction });
            break;
        case 7: // Tutor
            await Tutor.destroy({ where: { id_usuario: userId }, transaction });
            break;
    }
}

export const soapUsuarioService = {
    async obtenerUsuarios(args){
        try{
            const { page = 1, perPage = 10, numero_documento, id_rol } = args;

            const limit = parseInt(perPage);
            const offset = (parseInt(page) - 1) * limit;
            const whereClause = {};

            if(numero_documento) whereClause.numero_documento = { [Op.iLike]: `%${numero_documento}%` };

            if(id_rol){
                const usuariosConRol = await UsuarioRol.findAll({ where: { id_rol: id_rol }, attributes: ['id_usuario'] });
                const idsUsuarios = usuariosConRol.map(ur => ur.id_usuario);
                whereClause.id_usuario = { [Op.in]: idsUsuarios };
            }

            const { rows: users, count: total } = await Usuario.findAndCountAll({
                limit,
                offset,
                order: [["id_usuario", "ASC"]],
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"]
                    },
                ],
                attributes: { exclude: ["contrasenia", "creado_el", "actualizado_el"] },
                where: { ...whereClause },
                order: [["apellido", "ASC"], ["nombre", "ASC"]]
            });

            return { response: JSON.stringify({ data: users, total }) };
        }catch(error){
            console.error("Error al obtener usuarios:", error);
            return { response: "Error al obtener usuarios" };
        }
    },
    async obtenerUsuariosSinRol(args){
        try{
            const { page = 1, perPage = 10, nombre, apellido, numero_documento, sort, order } = args;

            const limit = parseInt(perPage);
            const offset = (parseInt(page) - 1) * limit;
            const whereClause = {};

            if (nombre) whereClause.nombre = { [Op.iLike]: `%${nombre}%` };
            if (apellido) whereClause.apellido = { [Op.iLike]: `%${apellido}%` };
            if (numero_documento) whereClause.numero_documento = { [Op.iLike]: `%${numero_documento}%` };

            const usuariosConRol = await UsuarioRol.findAll({ attributes: ['id_usuario'] });
            const idsUsuariosConRol = usuariosConRol.map(ur => ur.id_usuario);
            if (idsUsuariosConRol.length > 0) {
                whereClause.id_usuario = { [Op.notIn]: idsUsuariosConRol };
            }

            // Orden dinámico con default apellido ASC y desempate por nombre
            const allowedSortFields = ['apellido', 'nombre', 'numero_documento', 'email', 'id_usuario', 'legajo'];
            const sortField = (sort && allowedSortFields.includes(String(sort))) ? String(sort) : 'apellido';
            const sortOrder = (order && String(order).toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
            const orderClause = [[sortField, sortOrder], ['apellido', 'ASC'], ['nombre', 'ASC']];

            const { rows: users, count: total } = await Usuario.findAndCountAll({
                limit,
                offset,
                order: orderClause,
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"]
                    },
                ],
                attributes: { include: ["numero_documento"], exclude: ["contrasenia", "creado_el", "actualizado_el"] },
                where: { ...whereClause },
                order: [["apellido", "ASC"], ["nombre", "ASC"]]
            });

            return { response: JSON.stringify({ data: users, total }) };
        }catch(error){
            console.error("Error al obtener usuarios sin rol:", error);
            return { response: "Error al obtener usuarios sin rol" };
        }
    },
    async obtenerUsuariosConRol(args){
        try{
            const { page = 1, perPage = 10, nombre, apellido, numero_documento, id_rol, sort, order } = args;

            const limit = parseInt(perPage);
            const offset = (parseInt(page) - 1) * limit;
            const whereClause = {};

            if (nombre) whereClause.nombre = { [Op.iLike]: `%${nombre}%` };
            if (apellido) whereClause.apellido = { [Op.iLike]: `%${apellido}%` };
            if (numero_documento) whereClause.numero_documento = { [Op.iLike]: `%${numero_documento}%` };

            // Filtrado por rol
            const whereUsuarioRol = {};
            if (id_rol) whereUsuarioRol.id_rol = id_rol;
            const usuariosConRol = await UsuarioRol.findAll({ where: whereUsuarioRol, attributes: ['id_usuario'] });
            const idsUsuariosConRol = usuariosConRol.map(ur => ur.id_usuario);
            whereClause.id_usuario = { [Op.in]: idsUsuariosConRol };

            // 🆕 orden dinámico
            const { rows: users, count: total } = await Usuario.findAndCountAll({
                limit,
                offset,
                order: [[ (sort && ['apellido','nombre','numero_documento','email','id_usuario','legajo'].includes(String(sort)) ? String(sort) : 'apellido'), ((order && String(order).toUpperCase() === 'DESC') ? 'DESC' : 'ASC') ], ['apellido','ASC'], ['nombre','ASC']],
                include: [
                {
                    model: Rol,
                    as: "roles",
                    through: { attributes: [] },
                    attributes: ["id_rol", "nombre_rol"],
                },
                ],
                attributes: {
                    include: ["numero_documento"],
                    exclude: ["contrasenia", "creado_el", "actualizado_el"],
                },
                where: { ...whereClause },
            });

            return { response: JSON.stringify({ data: users, total }) };
        }catch(error){
            console.error("Error al obtener usuarios con rol:", error);
            return { response: "Error al obtener usuarios con rol" };
        }
    },
    async obtenerUsuario(args){
        try{
            const { id_usuario } = args;

            const user = await Usuario.findByPk(id_usuario, { 
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"]
                    },
                ],
                attributes: { exclude: ["contrasenia", "creado_el", "actualizado_el"] }
            });

            return { response: JSON.stringify(user) };
        }catch(error){
            console.error("Error al obtener usuario:", error);
            return { response: "Error al obtener usuario" };
        }
    },
    async crearUsuario(args){
        const t = await sequelize.transaction();
        try{
            const { nombre, apellido, numero_documento, legajo, email, telefono, domicilio, fecha_nacimiento, genero, contrasenia } = args;
            const hashedPassword = await bcrypt.hash(contrasenia, 10);

            const newUser = await Usuario.create({
                nombre: nombre,
                apellido: apellido,
                numero_documento: numero_documento,
                legajo: legajo,
                email: email,
                telefono: telefono ? telefono : null,
                domicilio: domicilio ? domicilio : null,
                fecha_nacimiento: fecha_nacimiento ? fecha_nacimiento : null,
                genero: genero ? genero : null,
                contrasenia: hashedPassword
            }, { transaction: t });
            // Rol assignment removed: users are created without a role from this endpoint

            await t.commit();

            const newUserWithRoles = await Usuario.findByPk(newUser.id_usuario, 
                { 
                    include: [
                        {
                            model: Rol,
                            as: "roles",
                            through: { attributes: [] },
                            attributes: ["id_rol", "nombre_rol"]
                        },
                    ],
                    attributes: { exclude: ["contrasenia", "creado_el", "actualizado_el"] }
                });

            return { response: JSON.stringify(newUserWithRoles) };
        }catch(error){
            console.error("Error al crear usuario:", error);
            await t.rollback();
            return { response: "Error al crear usuario" };
        }
    },
    async actualizarUsuario(args){
        const t = await sequelize.transaction();
        try{
            const { id_usuario, nombre, apellido, numero_documento, legajo, email, telefono, domicilio, fecha_nacimiento, genero } = args;

            const user = await Usuario.findByPk(id_usuario, { 
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"]
                    },
                ]
            });

            await user.update({
                nombre: nombre,
                apellido: apellido,
                numero_documento: numero_documento,
                legajo: legajo,
                email: email,
                telefono: telefono,
                domicilio: domicilio,
                fecha_nacimiento: fecha_nacimiento,
                genero: genero
            }, { transaction: t });
            // Role changes removed: this endpoint no longer updates roles
            
            await t.commit();

            const updatedUser = await Usuario.findByPk(id_usuario, { 
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"]
                    },
                ],
                attributes: { exclude: ["contrasenia", "creado_el", "actualizado_el"] }
            });

            return { response: JSON.stringify(updatedUser) };
        }catch(error){
            console.error("Error al actualizar usuario:", error);
            await t.rollback();
            return { response: "Error al actualizar usuario" };
        }
    },
    async eliminarUsuario(args){
        const t = await sequelize.transaction();
        try{
            const { id_usuario } = args;
            const user = await Usuario.findByPk(id_usuario, { 
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"]
                    },
                ]
            });
    
            // Clean up role relations if any exist
            await UsuarioRol.destroy({ where: { id_usuario: user.id_usuario }, transaction: t });
            if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                for (const role of user.roles) {
                    await deleteUserInRoleTable(role.id_rol, user.id_usuario, t);
                }
            }
            await user.destroy({ transaction: t });
    
            await t.commit();

            return { response: "Usuario eliminado correctamente" };
        }catch(error){
            console.error("Error al eliminar usuario:", error);
            await t.rollback();
            const customMessage = error.name === 'SequelizeForeignKeyConstraintError'
            ? 'No se puede eliminar el usuario porque está asociado a otros registros.'
            : error.message;
            return { response: customMessage };
        }
    },
    asignarRolAUsuario: async (args) => {
        const t = await sequelize.transaction();
        try{
            const { id_usuario, id_rol } = args;

            const user = await Usuario.findByPk(id_usuario, { transaction: t });
            const role = await Rol.findByPk(id_rol, { transaction: t });
            if (!user) return { response: "El usuario no existe" };
            if (!role) return { response: "El rol no existe" };

            const currentRoles = await UsuarioRol.findAll({ where: { id_usuario }, transaction: t });
    
            // Idempotencia: si ya tiene exactamente ese rol, no hacer cambios
            if (currentRoles.length === 1 && currentRoles[0].id_rol === id_rol) {
                await t.commit();
                const updatedUser = await Usuario.findByPk(id_usuario, {
                    include: [{ model: Rol, as: "roles", through: { attributes: [] }, attributes: ["id_rol", "nombre_rol"] }],
                    attributes: { exclude: ["contrasenia", "creado_el", "actualizado_el"] }
                });
                return updatedUser;
            }
    
            // Limpiar roles anteriores y tablas específicas
            if (currentRoles.length > 0) {
                for (const cr of currentRoles) {
                    await deleteUserInRoleTable(cr.id_rol, id_usuario, t);
                }
                await UsuarioRol.destroy({ where: { id_usuario }, transaction: t });
            }
    
            // Asignar nuevo rol y crear en tabla específica
            await UsuarioRol.create({ id_usuario, id_rol }, { transaction: t });
            await createUserInRoleTable(id_rol, id_usuario, t);
    
            await t.commit();
    
            const updatedUser = await Usuario.findByPk(id_usuario, {
                include: [{ model: Rol, as: "roles", through: { attributes: [] }, attributes: ["id_rol", "nombre_rol"] }],
                attributes: { exclude: ["contrasenia", "creado_el", "actualizado_el"] }
            });

            return { response: JSON.stringify(updatedUser) };
        }catch(error){
            console.error("Error al asignar rol a usuario:", error);
            await t.rollback();
            return { response: "Error al asignar rol a usuario" };
        }
    },
    async desasignarRolDeUsuario(args){
        const t = await sequelize.transaction();
        try{
            const { id_usuario } = args;
            const user = await Usuario.findByPk(id_usuario, {
                include: [{ model: Rol, as: "roles", through: { attributes: [] }, attributes: ["id_rol", "nombre_rol"] }],
                transaction: t
            });
            if (!user) return { response: "El usuario no existe" };
    
            // Eliminar relaciones en intermedia y tablas específicas
            await UsuarioRol.destroy({ where: { id_usuario }, transaction: t });
            if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                for (const role of user.roles) {
                    await deleteUserInRoleTable(role.id_rol, id_usuario, t);
                }
            }
    
            await t.commit();

            return { response: "Rol desasignado correctamente" };
        }catch(error){
            console.error("Error al desasignar rol de usuario:", error);
            await t.rollback();
            return { response: "Error al desasignar rol de usuario" };
        }
    }
}