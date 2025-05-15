🌦️ Weather App - Docker Multicontainer Setup
This project includes three main services: a NestJS backend, a Vite + React frontend, a PostgreSQL database, and a pgAdmin GUI for database management. All services are orchestrated using Docker Compose.

📦 Included Services
Service Description Local Port
PostgreSQL Stores weather-related data. 5436 (internal: 5432)
Backend NestJS API for handling data and auth. 3000, 9229 (debug)
Frontend React app consuming the API. 5173
pgAdmin GUI for managing PostgreSQL. 5050

🚀 Getting Started
Make sure you have Docker and Docker Compose installed.

Run the following command to start all containers:

docker-compose up --build

🗃️ Accessing the Services
Service Local URL
Frontend http://localhost:5173
Backend API http://localhost:3000
pgAdmin http://localhost:5050

🔐 pgAdmin Credentials:
Email: admin@admin.com

Password: pgadmin4

Once logged in, add a new server with:

Host: postgresDB

User: postgres

Password: postgres

Database: db_weather

⚠️ Troubleshooting: Backend Can't Connect to DB
If the backend fails to connect to the database (e.g., connection errors or timeout):

Stop the containers:

docker-compose down
Delete the backend container explicitly:

docker rm backend
Rebuild and restart all services:

docker-compose up --build
This ensures environment variables are correctly re-applied and connectivity is re-established.

⚙️ Important Environment Variables
Defined inside docker-compose.yml.

🔐 Backend:
env
POSTGRES_HOST=postgresDB
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=db_weather
POSTGRES_SSL=false
JWT_SECRET=awjdiao9jdsoiajwioa
WEATHER_API_KEY=77cb5131b1d945aa8cf201322251205
🧪 Development Notes
The backend runs using pnpm run start:debug.

Volumes allow hot-reloading of local code changes without rebuilding the image.

🧹 Useful Commands
Action Command
Start all services docker-compose up --build
Stop all services docker-compose down
View logs in real time docker-compose logs -f
Access DB container docker exec -it postgresDB psql -U postgres

📁 Project Structure
.
├── backend/ # NestJS API
├── frontend/ # React (Vite)
├── postgres/ # Persistent volume for PostgreSQL
├── docker-compose.yml
└── README.md
