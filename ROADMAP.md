# KanBan Board — Project Roadmap

## Current State

- **Frontend/** — React + Vite + TypeScript + Tailwind + dnd-kit + Three.js (Claude owns this)
- **Backend/** — Express skeleton with one route, no package.json yet
- **DB/** — empty folder
- **Root** — empty docker-compose.yml, .dockerignore started, no git repo yet

---

## Phase 0: Project Foundation

> Get the basics right before writing real code.

- [X] `git init` and set up `.gitignore` (node_modules, .env, dist, etc.)
- [X] Create `Backend/package.json` (`npm init`) and install Express
- [X] Fix Backend/src/index.js — pick one module system (ES modules or CommonJS), add `app.listen()`
- [X] Create a `.env` file pattern — decide where secrets live (DB credentials, ports)

**You'll learn:** git basics, npm project setup, ES modules vs CommonJS

---

## Phase 1: Database

> Set up PostgreSQL and learn how an app talks to a database.

- [X] Choose a DB — PostgreSQL is the standard pick for this kind of project
- [ ] Design the schema: `boards`, `columns`, `cards` (think about what fields a kanban card needs)
- [X] Write SQL init script (`DB/init.sql`) to create tables
- [ ] Install a Node.js DB client (`pg` library) in Backend
- [ ] Connect Express to PostgreSQL — write a simple query to test the connection

**You'll learn:** SQL, relational schema design, connection strings, environment variables

---

## Phase 2: Backend API

> Build the REST API that the frontend will consume.

- [ ] Plan your endpoints (REST convention):
  - `GET /api/boards` — list boards
  - `POST /api/boards` — create board
  - `GET /api/boards/:id` — get board with columns and cards
  - `POST /api/columns` — create column
  - `PATCH /api/columns/:id` — update column (rename, reorder)
  - `DELETE /api/columns/:id` — delete column
  - `POST /api/cards` — create card
  - `PATCH /api/cards/:id` — update card (move, edit, reorder)
  - `DELETE /api/cards/:id` — delete card
- [ ] Set up Express router structure (`routes/`, `controllers/`)
- [ ] Implement CRUD for boards, columns, cards
- [ ] Add request validation (check required fields exist)
- [ ] Add error handling middleware
- [ ] Test endpoints with curl or Postman

**You'll learn:** REST API design, Express routing/middleware, SQL queries from Node, error handling

---

## Phase 3: Docker

> Containerize everything so it runs the same way everywhere.

- [ ] Write `Backend/Dockerfile` — Node.js container that runs your API
- [ ] Write `Frontend/Dockerfile` — build step + nginx to serve the static files
- [ ] Set up `docker-compose.yml` with 3 services:
  - `db` — PostgreSQL image, with volume for persistence
  - `backend` — your API, depends on db
  - `frontend` — nginx serving the built React app
- [ ] Configure networking — frontend talks to backend, backend talks to db
- [ ] Use `.env` file with docker-compose for secrets/config
- [ ] `docker compose up` and verify everything works together

**You'll learn:** Dockerfiles, multi-stage builds, docker-compose, container networking, volumes

---

## Phase 4: Connect Frontend to Backend

> Wire the UI to real data (Claude builds the frontend integration, you review).

- [ ] Set up API client in Frontend (fetch or axios)
- [ ] Replace any mock/hardcoded data with API calls
- [ ] Handle loading and error states
- [ ] Make drag-and-drop persist changes via PATCH endpoints
- [ ] Add CORS configuration in Backend

**You'll learn:** how frontend-backend communication works, CORS, API integration patterns

---

## Phase 5: DevOps & Deployment

> Get it running on a real server.

- [ ] Pick a hosting target (VPS like DigitalOcean/Hetzner, or a free tier like Railway/Render)
- [ ] Set up a reverse proxy (nginx or Caddy) to route traffic
- [ ] Configure environment variables for production
- [ ] Set up CI/CD — GitHub Actions to build/test on push
- [ ] Add a health check endpoint (`GET /api/health`)
- [ ] (Optional) Add SSL/HTTPS with Let's Encrypt

**You'll learn:** Linux server basics, reverse proxies, CI/CD pipelines, environment management

---

## Phase 6: Polish & Extras (Optional)

> Nice-to-haves once the core works.

- [ ] User authentication (JWT or sessions)
- [ ] WebSocket for real-time board updates
- [ ] Database migrations tool (like `node-pg-migrate`)
- [ ] Logging (structured logs with pino or winston)
- [ ] Rate limiting and security headers (helmet)
- [ ] Monitoring / uptime checks

---

## Who Does What

| Area | Owner |
|------|-------|
| Backend API | You |
| Database schema & queries | You |
| Docker & docker-compose | You |
| CI/CD & deployment | You |
| Frontend UI & components | Claude |
| API integration in frontend | Claude (you review) |


### DB design
 Цель данной базы данных является хранение информации о пользователях, досках, задачах (возможно workflow - имеется ввиду доска где хранятся списки в которых есть задачи)
  
1. Пользователь: ID, Логин, Хэш_Пароль, Name, Surname 
2. List: ID, Title, Board ID
3. Задача: ID, Title, Text, List ID, position
4. Доска: ID, User ID
   
- Как будет работать Drag & Drop система - position. Вопрос лишь в том как понимать позицию задачи среди других
- Переименование - ID не меняется, меняется лишь Имя
- Новый текст в задачи - ID не меняется, меняется лишь текст
- Счёт задач в доске - SELECT COUNT(*) FROM tasks WHERE board_id = 5;   
- Пароль хэшируется и уже хэш пароля выводится в таблицу. Вопрос лишь в как это будет происходить. Нужно в таком случае прописывать хэш функцию. Не понятно немного это