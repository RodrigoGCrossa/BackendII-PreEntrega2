# Encuentro Tech — Registro seguro de usuarios

API para una plataforma de eventos tecnológicos, talleres y conferencias. Registro de usuarios con validaciones, email normalizado, bcrypt y persistencia mediante Mongoose.

## Tecnologías y requisitos

Node.js 22 o superior, npm, JavaScript con módulos ESM, Express 5, dotenv y Mongoose. Bcrypt protege las contraseñas.

## Instalación y ejecución

```bash
npm install
cp .env.example .env
# Completar las variables del archivo .env
npm start
# Desarrollo con reinicio automático:
npm run dev
```

Necesitás una instancia MongoDB accesible y una URL propia en `MONGO_URL`; puede ser local o Atlas. No se incluyen cuentas, conexiones de terceros ni credenciales. El servidor espera la conexión y la creación de índices antes de escuchar peticiones; ante un fallo de configuración o conexión finaliza con error.

| Variable | Uso |
|---|---|
| `PORT` | Puerto HTTP; 8080 por defecto |
| `NODE_ENV` | `development`, `test` o `production` |
| `MONGO_URL` | URL propia de MongoDB (obligatoria) |
| `JWT_SECRET` | Clave privada propia (reservada para autenticación) |

El archivo `.env` es local y se excluye de Git. `.env.example` solo incluye nombres de variables y valores públicos de desarrollo.

## Estructura y responsabilidades

```text
src/
  app.js                 # configura Express y conecta routers
  server.js              # configura el arranque del servidor
  config/                # entorno, conexión MongoDB
  routes/                # método, URL y middlewares
  controllers/           # request y response
  services/              # reglas de negocio
  repositories/          # operaciones de persistencia
  dao/                   # acceso a Mongoose
  models/                # User y Event
  middlewares/           # errores
  utils/                 # helpers reutilizables
tests/                   # pruebas unitarias, HTTP e integración
```

Registro: `ruta → controller → service → repository → DAO → modelo`.
## Rutas

| Método | Ruta | Acceso y respuesta |
|---|---|---|
| GET | `/api/health` | Público, estado del servidor (200) |
| GET | `/api/events` | Público, lista vacía (200) |
| POST | `/api/sessions/register` | Público, crea usuario (201) |

### Salud y eventos iniciales

```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/events
```

`GET /api/health` devuelve `{"status":"ok","message":"Servidor activo"}`.

`GET /api/events` devuelve `{"status":"success","payload":[]}`.

### Registro seguro

Campos obligatorios: `first_name`, `last_name`, `email` y `password`. La contraseña requiere al menos **8 caracteres** y como máximo **72 bytes UTF-8** (límite de bcrypt). Los nombres se recortan y el email se normaliza con trim y minúsculas. El rol del body se ignora: el registro público siempre crea `user`. Los roles admitidos por el modelo son `user`, `organizer` y `admin`. El email tiene índice único, además de la comprobación previa de duplicados.

```bash
curl -i -X POST http://localhost:8080/api/sessions/register   -H 'Content-Type: application/json'   -d '{"first_name":"Ana","last_name":"Pérez","email":"Ana@Mail.com ","password":"Secreta123"}'
```

Respuesta 201 (el ID lo genera MongoDB):

```json
{"status":"success","payload":{"id":"665f2a000000000000000001","first_name":"Ana","last_name":"Pérez","email":"ana@mail.com","role":"user"}}
```

Campos faltantes: 400 `{"status":"error","message":"Faltan campos obligatorios"}`. Email inválido: 400 con `Email inválido`. Contraseña fuera del rango: 400 con explicación. Duplicado: 409 `{"status":"error","message":"El email ya está registrado"}`. La contraseña se guarda con bcrypt (10 salt rounds) y nunca se devuelve.

## Pruebas

```bash
npm test
npm run test:api
npm run test:integration
```

`npm test` ejecuta pruebas unitarias de validaciones y respuestas de error sin servicios externos. `test:api` ejecuta peticiones reales contra Express mediante Supertest con sustitutos de los repositorios en memoria; bcrypt, JWT y Passport se ejecutan realmente según la etapa. Estas pruebas HTTP no verifican persistencia MongoDB ni entrega SMTP.

La prueba de integración queda **omitida explícitamente** si no configurás `TEST_MONGO_URL`. Para ejecutarla, usá una base exclusiva de pruebas: `TEST_MONGO_URL="URL_DE_TU_BASE_DE_PRUEBAS" npm run test:integration`. Crea un usuario temporal, comprueba el hash persistido y lo elimina al terminar. No apunta por defecto a tu base normal.

Verificación realizada: sintaxis y pruebas unitarias aprobadas. Se incluye una suite HTTP con dobles para ejecutar después de instalar dependencias. Las integraciones MongoDB y SMTP reales requieren configuración propia y no se presentan como verificadas.
