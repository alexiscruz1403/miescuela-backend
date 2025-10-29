import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { sequelize } from "./config/database.js";
// Inicializa asociaciones entre modelos
import "./models/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

// ====================== SOAP ====================
import soap from "soap";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { soapService } from "./soapService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wsdlPath = path.join(__dirname, "service.wsdl");
const wsdl = fs.readFileSync(wsdlPath, "utf8");
const SOAP_PATH = "/soap"; // ruta del servicio

// =================================================

// ====================== Rutas ===================
import authRoutes from "./routes/auth.routes.js";
import asistenciaRoutes from "./routes/asistencia.routes.js";
import asistenciaEstadoRoutes from "./routes/asistenciaEstado.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import rolRoutes from "./routes/roles.routes.js";
import cursoRoutes from "./routes/curso.routes.js";
import alumnoRoutes from "./routes/alumno.routes.js"
import materiaRoutes from "./routes/materia.routes.js";
import calificacionRoutes from "./routes/calificacion.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import cicloLectivoRoutes from "./routes/cicloLectivo.routes.js";
import informePedagogicoRoutes from "./routes/informePedagogico.js";
import asesorPedagogicoRoutes from "./routes/asesorPedagogico.routes.js";
import estadisticasRoutes from "./routes/estadisticas.routes.js";
// =================================================

// ====================== Rutas SOAP ===================
import alumnoSoapWrapperRoutes from "./routes/alumnoSoapWrapper.routes.js";
import authSoapWrapperRoutes from "./routes/authSoapWrapper.routes.js";
import asesorPedagogicoSoapWrapperRoutes from "./routes/asesorPedagogicoSoapWrapper.routes.js";
import asistenciaSoapWrapperRoutes from "./routes/asistenciaSoapWrapper.routes.js";
import asistenciaEstadoSoapWrapperRoutes from "./routes/asistenciaEstadoSoapWrapper.routes.js";
import calificacionSoapWrapperRoutes from "./routes/calificacionSoapWrapper.routes.js";
import cicloLectivoSoapWrapperRoutes from "./routes/cicloLectivoSoapWrapper.routes.js";
import cursoSoapWrapperRoutes from "./routes/cursoSoapWrapper.routes.js";
import informePedagogicoSoapWrapperRoutes from "./routes/informePedagogicoSoapWrapper.routes.js";
import materiaSoapWrapperRoutes from "./routes/materiaSoapWrapper.routes.js";
import rolSoapWrapperRoutes from "./routes/rolSoapWrapper.routes.js";
import tutorSoapWrapperRoutes from "./routes/tutorSoapWrapper.routes.js";
import usuarioSoapWrapperRoutes from "./routes/usuarioSoapWrapper.routes.js";
// =================================================

const app = express();

// ──────────────── Middlewares globales ────────────────

app.use(helmet()); // Seguridad HTTP headers
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //  Cambiár la URL por la del frontend en producción

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); // Logs de peticiones

// Limitador de requests (anti fuerza bruta/DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 100 requests por IP
  message: "⚠️ Demasiadas solicitudes, intenta más tarde."
});
app.use("/api", limiter);

app.use(cookieParser()); // Parseo de cookies

// ──────────────── ROUTER ────────────────
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a MiEscuela 4.0 Backend 🚀" });
});

app.use("/api/asistencias", asistenciaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/asistencia-estados", asistenciaEstadoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/alumnos", alumnoRoutes )
app.use("/api/materias", materiaRoutes);
app.use("/api/calificaciones", calificacionRoutes);
app.use("/api/tutores", tutorRoutes);
app.use("/api/ciclos-lectivos", cicloLectivoRoutes);
app.use("/api/informes-pedagogicos", informePedagogicoRoutes);
app.use("/api/asesores-pedagogicos", asesorPedagogicoRoutes);
app.use("/api/estadisticas", estadisticasRoutes);


// ──────────────── ROUTER SOAP ────────────────
app.use("/soap/alumnos", alumnoSoapWrapperRoutes);
app.use("/soap/auth", authSoapWrapperRoutes);
app.use("/soap/asesores-pedagogicos", asesorPedagogicoSoapWrapperRoutes);
app.use("/soap/asistencias", asistenciaSoapWrapperRoutes);
app.use("/soap/asistencia-estados", asistenciaEstadoSoapWrapperRoutes);
app.use("/soap/calificaciones", calificacionSoapWrapperRoutes);
app.use("/soap/ciclos-lectivos", cicloLectivoSoapWrapperRoutes);
app.use("/soap/cursos", cursoSoapWrapperRoutes);
app.use("/soap/informes-pedagogicos", informePedagogicoSoapWrapperRoutes);
app.use("/soap/materias", materiaSoapWrapperRoutes);
app.use("/soap/roles", rolSoapWrapperRoutes);
app.use("/soap/tutores", tutorSoapWrapperRoutes);
app.use("/soap/usuarios", usuarioSoapWrapperRoutes);

// ──────────────── Manejo de errores ────────────────
app.use(errorHandler);

// ──────────────── Arranque del servidor ────────────────
const PORT = process.env.PORT;

soap.listen(app, SOAP_PATH, soapService, wsdl);

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  try {
    await sequelize.authenticate(); 
    console.log("Conexión a la base de datos exitosa ✅");
  } catch (error) {
    console.error("Error al conectar DB ❌:", error);
  }
});
