// /soap/auth.service.js
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.util.js";
import { Usuario, Rol } from "../models/index.js";
import { ar } from "zod/v4/locales";

export const soapAuthService = {
    async login(args) {
        try {
            const { email, contrasenia } = args;

            if (!email || !contrasenia) return { response: "Email y contraseña son requeridos" };

            const user = await Usuario.findOne({
                where: { email },
                include: [
                    {
                        model: Rol,
                        as: "roles",
                        through: { attributes: [] },
                        attributes: ["id_rol", "nombre_rol"],
                    },
                ],
            });

            const isValidPassword = user ? await bcrypt.compare(contrasenia, user.contrasenia) : false;

            if (!user || !isValidPassword) return { response: "Correo electrónico o contraseña incorrectos" };

            const rol = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0].nombre_rol : null;
            const notificaciones = 0; // placeholder

            const payload = {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol,
                notificaciones,
            };

            const csrf_token = crypto.randomBytes(32).toString("hex");
            const access_token = generateAccessToken(payload);
            const refresh_token = generateRefreshToken(payload);

            return {
                response: JSON.stringify({
                    message: "Inicio de sesión exitoso",
                    data: {
                        csrf_token,
                        access_token,
                        refresh_token,
                        user: { nombre: user.nombre, apellido: user.apellido, email: user.email, rol, notificaciones },
                    },
                }),
            };
        } catch (error) {
            console.error("SOAP login error:", error);
            return { response: "Error en el login" };
        }
    },

    async refresh(args) {
        try {
            const refreshToken = args.refreshToken;
            if (!refreshToken) return { response: "Token de renovación es requerido" };

            const payload = verifyToken(refreshToken, "refresh");
            const newAccessToken = generateAccessToken(payload);
            const user = { nombre: payload.nombre, apellido: payload.apellido, email: payload.email, rol: payload.rol, notificaciones: payload.notificaciones };

            return {
                response: JSON.stringify({
                    message: "Token de acceso renovado exitosamente",
                    data: { newAccessToken, user },
                }),
            };
        } catch (error) {
            console.error("SOAP refresh error:", error);
            return { response: "Token de renovación inválido o expirado" };
        }
    },

    async logout(args) {
        // Para SOAP no usamos cookies, solo devolvemos mensaje
        return { response: JSON.stringify({ message: "Cierre de sesión exitoso" }) };
    },
};
