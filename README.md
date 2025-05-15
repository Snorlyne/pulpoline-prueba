# Weather App - Docker Multicontainer Setup

Este proyecto incluye tres servicios principales: un backend en NestJS, un frontend en Vite + React, una base de datos PostgreSQL y una interfaz gráfica pgAdmin para la gestión de la base de datos. Todos los servicios son orquestados mediante Docker Compose.

## Servicios incluidos

| Servicio   | Descripción                                     | Puerto local         |
| ---------- | ----------------------------------------------- | -------------------- |
| PostgreSQL | Almacena datos relacionados con el clima        | 5436 (interno: 5432) |
| Backend    | API NestJS para manejo de datos y autenticación | 3000, 9229 (debug)   |
| Frontend   | Aplicación React que consume la API             | 5173                 |
| pgAdmin    | GUI para gestionar PostgreSQL                   | 5050                 |

## Primeros pasos

Asegúrate de tener instalados Docker y Docker Compose.

Ejecuta el siguiente comando para iniciar todos los contenedores:

```bash
docker-compose up --build
```

## Acceso a los servicios

| Servicio    | URL local             |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| pgAdmin     | http://localhost:5050 |

### Credenciales de pgAdmin:

- **Email**: admin@admin.com
- **Password**: pgadmin4

Una vez iniciada la sesión, añade un nuevo servidor con:

- **Host**: postgresDB
- **Usuario**: postgres
- **Contraseña**: postgres
- **Base de datos**: db_weather

## Solución de problemas: El backend no puede conectarse a la BD

Si el backend falla al conectarse a la base de datos (por ejemplo, errores de conexión o tiempo de espera):

1. Detén los contenedores:

```bash
docker-compose down
```

2. Elimina explícitamente el contenedor backend:

```bash
docker rm backend
```

3. Reconstruye y reinicia todos los servicios:

```bash
docker-compose up --build
```

Esto asegura que las variables de entorno se apliquen correctamente y que la conectividad se restablezca.

## Variables de entorno importantes

Definidas dentro de `docker-compose.yml`.

**Backend**:

```
POSTGRES_HOST=postgresDB
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=db_weather
POSTGRES_SSL=false
JWT_SECRET=awjdiao9jdsoiajwioa
WEATHER_API_KEY=77cb5131b1d945aa8cf201322251205
```

## Notas de desarrollo

- El backend se ejecuta usando `pnpm run start:debug`.
- Los volúmenes permiten la recarga en caliente de los cambios de código locales sin reconstruir la imagen.

## Estructura del proyecto

```
.
├── backend/     # API NestJS
├── frontend/    # React (Vite)
├── postgres/    # Volumen persistente para PostgreSQL
├── docker-compose.yml
└── README.md
```

## Endpoints de la API Backend

Base URL: `/api/v1`

### Autenticación

#### `POST /auth/register`

Registra un nuevo usuario.

**Cuerpo de la solicitud**:

```json
{
  "username": "user123",
  "password": "securePassword"
}
```

**Respuestas**:

- **201 Created**: Usuario creado con éxito.
- **400 Bad Request**: El nombre de usuario ya existe o datos inválidos.

#### `POST /auth/login`

Inicia sesión de un usuario existente y recibe un token JWT.

**Cuerpo de la solicitud**:

```json
{
  "username": "user123",
  "password": "securePassword"
}
```

**Respuestas**:

- **200 OK**: Inicio de sesión exitoso.

```json
{
  "token": "<jwt_token>"
}
```

- **401 Unauthorized**: Nombre de usuario o contraseña no válidos.

### Favoritos (Requiere autenticación)

Todos los endpoints de favoritos requieren el encabezado:
`Authorization: Bearer <token>`

#### `POST /favorites`

Crea un nuevo favorito para el usuario autenticado.

**Cuerpo de la solicitud**:

```json
{
  "city": "Madrid"
}
```

**Respuestas**:

- **201 Created**: Favorito creado con éxito.
- **400 Bad Request**: Datos inválidos.
- **409 Conflict**: El favorito ya existe.
- **500 Internal Server Error**: Error interno del servidor.

#### `GET /favorites`

Obtiene todas las ciudades favoritas del usuario autenticado.

**Respuestas**:

- **200 OK**: Devuelve una lista de favoritos.

```json
[{ "city": "Madrid" }, { "city": "Paris" }]
```

- **500 Internal Server Error**: Error interno del servidor.

#### `DELETE /favorites/:city`

Elimina una ciudad favorita de la lista del usuario autenticado.

**Parámetros**:

- `city` (string): Nombre de la ciudad a eliminar.

**Respuestas**:

- **200 OK**: Favorito eliminado con éxito.
- **400 Bad Request**: Nombre de ciudad no válido.
- **500 Internal Server Error**: Error interno del servidor.

### Clima

#### `GET /weather?city=<city>`

Obtiene datos actuales del clima por nombre de ciudad.

**Parámetros de consulta**:

- `city` (string, obligatorio): Nombre de la ciudad.

**Respuestas**:

- **200 OK**: Clima actual recuperado con éxito.
- **400 Bad Request**: Consulta de ciudad faltante o no válida.
- **500 Internal Server Error**: Error de la API del clima.

#### `GET /weather/autocomplete?query=<query>`

Autocompletado de búsqueda de ciudades.

**Parámetros de consulta**:

- `query` (string, obligatorio): Texto para autocompletar.

**Respuestas**:

- **200 OK**: Resultados de autocompletado recuperados con éxito.
- **400 Bad Request**: Parámetro de consulta faltante.
- **500 Internal Server Error**: Error de la API del clima.

## Cómo funciona la aplicación (estructura, decisiones, manejo de errores)

- Frontend construido con React usando Vite, maneja la autenticación con JWT almacenado en localStorage.
- Backend construido con NestJS, protege rutas con JWT AuthGuard.
- Los errores se manejan adecuadamente con códigos de estado HTTP claros y mensajes.
- Caché habilitado en algunos endpoints (por ejemplo, clima, favoritos) para mejorar el rendimiento.
- Docker Compose gestiona los servicios de backend, frontend, base de datos y pgAdmin para facilitar el desarrollo local y el despliegue.
