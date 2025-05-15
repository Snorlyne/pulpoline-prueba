Weather App - Docker Multicontainer Setup
This project includes three main services: a NestJS backend, a Vite + React frontend, a PostgreSQL database, and a pgAdmin GUI for database management. All services are orchestrated using Docker Compose.

Included Services
Service Description Local Port
PostgreSQL Stores weather-related data. 5436 (internal: 5432)
Backend NestJS API for handling data and auth. 3000, 9229 (debug)
Frontend React app consuming the API. 5173
pgAdmin GUI for managing PostgreSQL. 5050

Getting Started
Make sure you have Docker and Docker Compose installed.

Run the following command to start all containers:

docker-compose up --build

Accessing the Services
Service Local URL
Frontend http://localhost:5173
Backend API http://localhost:3000
pgAdmin http://localhost:5050

pgAdmin Credentials:
Email: admin@admin.com

Password: pgadmin4

Once logged in, add a new server with:

Host: postgresDB

User: postgres

Password: postgres

Database: db_weather

Troubleshooting: Backend Can't Connect to DB
If the backend fails to connect to the database (e.g., connection errors or timeout):

Stop the containers:

docker-compose down
Delete the backend container explicitly:

docker rm backend
Rebuild and restart all services:

docker-compose up --build
This ensures environment variables are correctly re-applied and connectivity is re-established.

Important Environment Variables
Defined inside docker-compose.yml.

Backend:
env
POSTGRES_HOST=postgresDB
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=db_weather
POSTGRES_SSL=false
JWT_SECRET=awjdiao9jdsoiajwioa
WEATHER_API_KEY=77cb5131b1d945aa8cf201322251205

Development Notes
The backend runs using pnpm run start:debug.

Volumes allow hot-reloading of local code changes without rebuilding the image.

Project Structure
.
├── backend/ # NestJS API
├── frontend/ # React (Vite)
├── postgres/ # Persistent volume for PostgreSQL
├── docker-compose.yml
└── README.md

Backend API Endpoints
Base URL: /api/v1

Authentication
POST /auth/register
Register a new user.

Request body:

json
Copiar
Editar
{
"username": "user123",
"password": "securePassword"
}
Responses:

201 Created: User created successfully.

400 Bad Request: Username already exists or invalid data.

POST /auth/login
Login an existing user and receive a JWT token.

Request body:

json
Copiar
Editar
{
"username": "user123",
"password": "securePassword"
}
Responses:

200 OK: Login successful.

json
Copiar
Editar
{
"token": "<jwt_token>"
}
401 Unauthorized: Invalid username or password.

Favorites (Authentication required)
All favorites endpoints require the header:
Authorization: Bearer <token>

POST /favorites
Create a new favorite for the authenticated user.

Request body:

json
Copiar
Editar
{
"city": "Madrid"
}
Responses:

201 Created: Favorite successfully created.

400 Bad Request: Invalid data.

409 Conflict: Favorite already exists.

500 Internal Server Error: Internal server error.

GET /favorites
Get all favorite cities for the authenticated user.

Responses:

200 OK: Returns a list of favorites.

json
Copiar
Editar
[
{ "city": "Madrid" },
{ "city": "Paris" }
]
500 Internal Server Error: Internal server error.

DELETE /favorites/:city
Remove a favorite city from the authenticated user's list.

Parameters:

city (string): City name to remove.

Responses:

200 OK: Favorite successfully removed.

400 Bad Request: Invalid city name.

500 Internal Server Error: Internal server error.

Weather
GET /weather?city=<city>
Get current weather data by city name.

Query parameters:

city (string, required): City name.

Responses:

200 OK: Current weather retrieved successfully.

400 Bad Request: City query missing or invalid.

500 Internal Server Error: Weather API error.

GET /weather/autocomplete?query=<query>
Autocomplete city search.

Query parameters:

query (string, required): Text to autocomplete.

Responses:

200 OK: Autocomplete results retrieved successfully.

400 Bad Request: Query parameter missing.

500 Internal Server Error: Weather API error.

How the app works (structure, decisions, error handling)
Frontend built with React using Vite, handles authentication with JWT stored in localStorage.

Backend built with NestJS, protects routes with JWT AuthGuard.

Errors are handled gracefully with clear HTTP status codes and messages.

Caching enabled on some endpoints (e.g., weather, favorites) for performance.

Docker Compose manages backend, frontend, database, and pgAdmin services for easy local development and deployment.
