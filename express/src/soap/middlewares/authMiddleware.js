import { verifyToken } from "../../utils/jwt.util.js";

export function authMiddleware(handler) {
    return async function(args, cb, headers) {
        try {
            if (!args) args = {}; // Asegurarse de que args sea un objeto
            
            // Obtenemos token y CSRF token de los argumentos SOAP
            const accessToken = headers.AuthHeader.accessToken;
            const csrfToken = headers.AuthHeader.csrfToken;

            // Validaciones
            if (!accessToken) return { resultado: "No autorizado: Access token no provisto" };

            if (!csrfToken) return { resultado: "No autorizado: CSRF token no provisto" };

            let usuario;
            try {
                usuario = verifyToken(accessToken, "access");
            } catch (err) {
                return { resultado: "Token de acceso inválido o expirado" };
            }
            // Guardamos el usuario en args para que el método lo pueda usar si quiere
            args.usuario = usuario;

            // Ejecutamos la función SOAP original
            return await handler(args);
        } catch (error) {
            console.error("Error en autenticación SOAP:", error);
            return { resultado: "Error interno de autenticación" };
        }
    };
}
