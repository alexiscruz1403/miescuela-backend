📘 MiEscuela 4.0 – Backend

Repositorio copia utilizado para Framework e Interoperaabilidad. Repositorio original: https://github.com/psantueno/TF-MiEscuela-Backend.git

🚀 Tecnologías principales

express -> Base del proyecto.

📦 Dependencias instaladas

## Seguridad

helmet -> Añade cabeceras HTTP de seguridad automáticamente.

cors -> Habilita o restringe el acceso de recursos entre dominios (Cross-Origin).

express-rate-limit -> Limita el número de peticiones que puede hacer un cliente en un periodo de tiempo.

bcrypt -> Hashear contraseñas antes de guardarlas en la base de datos.

jsonwebtokens -> Se usa para crear y verificar tokens JWT (JSON Web Tokens).

cookie-parser -> Permite leer y escribir cookies fácilmente en las peticiones HTTP.

## Validaciones

zod -> Librería para validación y tipado de datos.

## Base de datos

pg -> Driver oficial de PostgreSQL para Node.js.

## ORM

Sequelize -> Para interactuar con la base de datos usando modelos y objetos en lugar de SQL puro.

pg-hstore -> Utilidad que usa Sequelize para serializar objetos JSON en formato hstore de PostgreSQL.

## SOAP

soap -> Permite crear o consumir servicios SOAP en Node.js.

📂 Estructura inicial de carpetas
express
└── src
    ├── config/           # Configuración a la Base de Datos
    ├── controllers/      # Controladores que reciben las solicitudes HTTP
    ├── middlewares/      # Middlewares de validacion de solicitudes
    ├── models/           # Modelos de datos
    ├── routes/           # Rutas y endpoints
    ├── services/         # Logica de negocio
    ├── soap/             # Servicio SOAP
    └── utils/            # Logica reutilizable
strapi

## 🔧 Guía de instalación y ejecución
1. Clonar el repositorio
git clone:

→ con HTTPS:  https://github.com/psantueno/miescuela-backend.git

→ con SSH: git@github.com:alexiscruz1403/miescuela-backend.git

2. Instalar dependencias
npm install

3. Ejecutar en modo desarrollo
npm run dev

Abrí el navegador en: 👉 http://localhost:6543
