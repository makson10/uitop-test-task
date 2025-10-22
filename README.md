## Uitop Todo App

A full‑stack Todo application with a NestJS + Drizzle (SQLite) backend and a React + Vite frontend. Includes Swagger API docs, validation, and a clean UI with MUI and Tailwind.

## Project structure

- `backend/` – NestJS API, DB schema and migrations (Drizzle)
- `frontend/` – React app (Vite)
- `docker-compose.yaml` – Compose services for frontend and backend

## URLs and ports

- Frontend (Docker): http://localhost:3000
- Backend API: http://localhost:4000
- API Docs (Swagger): http://localhost:4000/api

The backend CORS is configured via `CORS_ORIGIN` env var (defaults to `http://localhost:5173` for local Vite dev). Frontend talks to the API via `VITE_API_URL` (defaults to `http://localhost:4000`).

## Environment variables

Create `.env` files in both `backend/` and `frontend/`.

backend/.env

```
# Port the NestJS server listens on (defaults to 4000)
PORT=4000

# SQLite database file/URL used by Drizzle
# For a local file, use the file: scheme
DB_FILE_NAME="/path/to/your/database.sqlite"

# CORS origin for the frontend
CORS_ORIGIN="http://localhost:5173"
```

frontend/.env

```
# Dev server port for Vite (defaults to 5173 if not set)
PORT=5173

# Base URL for API requests in the frontend (fallbacks to http://localhost:4000)
VITE_API_URL=http://localhost:4000
```

Notes:

- The frontend reads `VITE_API_URL` at build/dev time. When building inside Docker, the default (`http://localhost:4000`) is typically fine.
- Ensure the backend port (`PORT`) and frontend CORS origin (`http://localhost:3000`) align with your local setup.

## Quick start with Docker Compose

Prerequisites: Docker Desktop and Docker Compose.

1. Create the env files as above: `backend/.env` and `frontend/.env`.
2. Build and start services:

```
docker compose up -d --build
```

3. Open the app: http://localhost:3000

4. Explore API docs: http://localhost:4000/api

To stop:

```
docker compose down
```

## Local development (without Docker)

Run backend and frontend in separate terminals.

### Backend

```
cd backend
npm install

# Ensure backend/.env exists (see above)

# Optional: apply DB migrations with Drizzle
# This uses drizzle.config.ts (sqlite) to apply SQL migrations in src/common/db/migrations
npx drizzle-kit migrate

# Start in watch mode
npm run start:dev
```

The API will be available at http://localhost:4000 and Swagger at http://localhost:4000/api.

### Frontend

```
cd frontend
npm install

# Ensure frontend/.env exists (see above)

# Start Vite dev server
npm run dev
```

By default Vite uses port from `PORT` or falls back to 5173. Set `PORT=3000` to match backend CORS if needed. The app will be at http://localhost:3000.

## API overview

Base URL: `http://localhost:4000`

- `GET /todos` – List todos. Optional `?category=<string>` filter.
- `GET /todos/categories` – List distinct categories.
- `GET /todos/:id` – Get a single todo.
- `POST /todos` – Create a todo.
- `PATCH /todos/:id` – Update a todo.
- `DELETE /todos/:id` – Delete a todo.

Swagger docs with schemas: http://localhost:4000/api

## Scripts

### Backend

- `npm run start:dev` – Start Nest in watch mode
- `npm run start` – Start Nest
- `npm run start:prod` – Start the compiled app (`dist`)
- `npm run build` – Compile TypeScript

### Frontend

- `npm run dev` – Vite dev server
- `npm run build` – Type-check + build
- `npm run preview` – Preview built app
- `npm run test` – Unit tests (Vitest)
- `npm run test:coverage` – Coverage

## Testing

Backend:

```
cd backend
npm run test
```

Frontend:

```
cd frontend
npm run test
```

## Troubleshooting

- CORS errors: ensure the frontend runs on `http://localhost:3000` or update the backend CORS origin in `backend/src/main.ts` accordingly.
- API URL mismatch: set `VITE_API_URL` in `frontend/.env` to point to your backend (e.g., `http://localhost:4000`).
- SQLite path: if the DB file isn’t created, verify `DB_FILE_NAME` points to a writable path, e.g. `file:./data/todo.db` (create the `data/` folder if needed).
- Ports in use: change `PORT` (backend) or `PORT` (frontend) env vars to free ports.

### Decisions

- CORS via environment variable: CORS origin is configured through the `CORS_ORIGIN` env var in `backend/.env`, allowing flexible frontend URLs without code changes. Defaults to `http://localhost:5173` for local Vite dev.
- Separate API models vs DB schema: Swagger `Todo` entity is a plain class for API typing, while Drizzle manages database schema separately—clear separation at the cost of duplication.
- SWC for NestJS: Using SWC accelerates dev builds (`start`/`start:dev`), trading a tiny chance of TypeScript transform edge cases for speed.
- Axios error normalization: A response interceptor standardizes errors to `{ message, status, data }`, simplifying UI error handling but masking some raw Axios details.
- Map and Set for deletion timers: `useDeletionTimers` uses `Map<string, Timer>` for key-value pairs object with useful medoths and `Set<string>` for tracking deleting IDs without duplicates. More performant and semantically clear than arrays for this use case.

### A&Q

1. Did you use AI at any stage while working on this task? Why?

   - Yes, I sometimes used AI making this project. AI helps me speed up development: It was writing parts of README.md, testing my app on vulnerabilities, generating some boilerplate code. AI saves time on repetitive/boring tasks, which I can waste on more complex problems or architecture decisions.

2. What kind of problems or uncertainties AI helps you resolve during the process?
   - AI assistent helped me to solve my bugs, resolve errors, suggested improvements to code structure and functionality, authomated some repeatitive tasks. Thanks to this, I done this test task significantly faster.
