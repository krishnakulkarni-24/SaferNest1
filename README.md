# SaferNest - Disaster Management Platform

## Recent Updates (2026)

- Improved incident location input UX
- Fixed infinite render loop and dark mode bugs
- Enhanced admin UI: assign/hide tasks, modal overlays, role-based controls
- Incident type detection improved (supports "earthquake", correct icons/badges)
- Live updates via WebSocket (frontend ready; backend config may need review)
- Comprehensive project analysis and documentation


SaferNest is a real-time disaster response platform that connects citizens, volunteers, authorities, and admins for incident reporting, resource allocation, and task coordination.


## Tech Stack

- Backend: Spring Boot 3, Java 17, Spring Security (JWT), JPA, PostgreSQL, Lombok, MapStruct, WebSocket (STOMP)
- Frontend: React (Vite), Tailwind CSS, Axios, React Router, Zustand, SockJS + STOMP client
- DevOps: Docker, Docker Compose


## Folder Structure

```text
new-proj/
├── backend/
│   ├── src/main/java/com/safernest/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── enums/
│   │   ├── exception/
│   │   ├── mapper/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/application.properties
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── store/
│   ├── package.json
│   └── Dockerfile
├── database/schema.sql
├── docs/api.md
├── postman/SaferNest.postman_collection.json
└── docker-compose.yml
```


## RBAC Roles

- ADMIN: full control
- AUTHORITY: incident/resource/task management
- VOLUNTEER: task acceptance and participation
- CITIZEN: incident reporting and help requests


## Step-by-Step Local Setup

### 1) Start PostgreSQL
Option A: Local PostgreSQL (create `safernest` DB)

Option B (Docker):
```bash
docker compose up -d postgres
```

### 2) Run Backend
```bash
cd backend
mvn spring-boot:run
```

Default backend URL: `http://localhost:8081`

### 3) Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

### 4) Environment Variables

Backend supports:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `PORT`
- `APP_SEED_ENABLED`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`
- `OPENAI_MAX_TOKENS`

Frontend supports:
- `VITE_API_BASE_URL`
- `VITE_WS_URL`

Use provided `.env.example` files in both projects.
For backend local runs, create `backend/.env` (same keys as `.env.example`).
Use JDBC format for `DB_URL`, for example: `jdbc:postgresql://localhost:5432/safernest`.
For local + deployment checks, set `CORS_ALLOWED_ORIGINS` as comma-separated values, for example:
`http://localhost:5173,https://*.vercel.app,https://*.onrender.com`

To seed demo data, set `APP_SEED_ENABLED=true` in backend env and restart backend.
Seeded users:
- `admin@safernest.com` / `Admin@123`
- `authority@safernest.com` / `Authority@123`
- `volunteer@safernest.com` / `Volunteer@123`
- `citizen@safernest.com` / `Citizen@123`


## Key Features

- Real-time incident reporting and updates
- Role-based dashboards for Admin, Authority, Volunteer, Citizen
- Task assignment, completion, and resource management
- Live notifications (WebSocket)
- Responsive UI with dark mode

## API Endpoints

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Incidents
  - `POST /api/incidents`
  - `GET /api/incidents`
  - `PUT /api/incidents/{id}/status`
- Resources
  - `POST /api/resources`
  - `GET /api/resources`
- Tasks
  - `POST /api/tasks`
  - `GET /api/tasks`
  - `PUT /api/tasks/{id}/assign`
- Requests
  - `POST /api/requests`
  - `GET /api/requests`

Detailed API docs: `docs/api.md`


## WebSocket Real-time

- Endpoint: `/ws`
- Topic: `/topic/updates`
- Event types: new incident, status updates, task updates


## Database Schema

- SQL file: `database/schema.sql`
- JPA entities map directly to SQL schema


## Postman Collection

Import:
- `postman/SaferNest.postman_collection.json`

Set variables:
- `baseUrl`
- `token`
- `incidentId`
- `resourceId`
- `taskId`
- `volunteerId`


## Docker Full Stack Run

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`
- PostgreSQL: `localhost:5432`


## Deployment Notes (Render/Railway/Vercel/Netlify)

- Backend (Render/Railway): deploy `backend` as a Java service with env vars from `.env.example`
- PostgreSQL (Railway/Neon): set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- Frontend (Vercel/Netlify): set `VITE_API_BASE_URL` and `VITE_WS_URL` to backend public URL


## Production Checklist

## Troubleshooting & Notes

- If live updates do not appear, check backend WebSocket configuration and CORS settings.
- For incident type display issues, ensure frontend is rebuilt after backend/logic changes.
- To hide admin options for completed tasks/incidents, ensure you are using the latest frontend build.
- For demo/testing, use seeded users and enable `APP_SEED_ENABLED` in backend.

---
For detailed API usage, see [docs/api.md](docs/api.md). For further help, open an issue or contact the maintainer.

- Replace JWT secret with strong Base64 key
- Restrict CORS allowed origins
- Enable HTTPS in production
- Add monitoring/logging and database backups
