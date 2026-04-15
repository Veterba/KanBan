# KanBan

A self-hosted Kanban board. Drag tasks across lists, organize work, call it a day.

This is also a **learning project** — the goal is to build the backend, database, containerization, and deployment pipeline from scratch, end-to-end, on my own domain. The frontend is delegated to Claude so focus stays on the parts I'm trying to level up in (backend / DB / DevOps).

> **Status:** early development. DB schema is done, backend CRUD is in progress, nothing is deployed yet. See [ROADMAP.md](./ROADMAP.md) for the phase-by-phase plan.

---

## Tech Stack

| Layer    | Choice                                             |
|----------|----------------------------------------------------|
| Frontend | React + Vite + TypeScript + Tailwind + dnd-kit + Three.js |
| Backend  | Node.js + Express (ES modules)                     |
| Database | MySQL 8                                            |
| DB Client| `mysql2/promise`                                   |
| Infra    | Docker + docker-compose (planned)                  |
| Deploy   | VPS + Caddy + GitHub Actions (planned)             |

---

## Repo Layout

```
KanBan/
├── Backend/            # Express API (Node.js)
│   ├── src/
│   │   ├── index.js    # entrypoint
│   │   └── db.js       # MySQL connection pool
│   └── package.json
├── Frontend/           # React + Vite app
│   ├── src/
│   └── package.json
├── DB/
│   └── init.sql        # schema: Users, Boards, Lists, Tasks
├── docker-compose.yml  # (WIP)
├── ROADMAP.md          # step-by-step build plan
└── README.md           # you are here
```

---

## Prerequisites

- **Node.js** 20+ and npm
- **MySQL** 8+ running locally (or use Docker — see below)
- **Git**
- **Docker + Docker Compose** (optional for now, required later)

---

## Quick Start (Local Dev)

> This section assumes Phase 1–2 of the roadmap are complete. If you're cloning in the middle of development, some steps may not work yet.

### 1. Clone the repo

```bash
git clone <repo-url> KanBan
cd KanBan
```

### 2. Set up the database

**Option A — local MySQL:**
```bash
mysql -u root -p < DB/init.sql
```

**Option B — Docker (no local install):**
```bash
docker run -d --name kanban-db \
  -e MYSQL_ROOT_PASSWORD=dev \
  -e MYSQL_DATABASE=KanBan \
  -p 3306:3306 \
  -v "$(pwd)/DB/init.sql:/docker-entrypoint-initdb.d/init.sql" \
  mysql:8
```

Verify tables:
```bash
mysql -u root -p KanBan -e "SHOW TABLES;"
# expect: Boards, Lists, Tasks, Users
```

### 3. Configure the backend

```bash
cd Backend
npm install
cp .env.example .env   # then fill in real values
```

Required env vars (`Backend/.env`):
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=dev
DB_NAME=KanBan
```

### 4. Run the backend

```bash
npm run dev        # nodemon, restarts on save
# or
npm start          # plain node
```

Health check:
```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

### 5. Run the frontend

```bash
cd ../Frontend
npm install
npm run dev
```

Open `http://localhost:5173` — the app will talk to the backend on port 4000.

---

## Full Stack via Docker Compose (planned)

Once Phase 5 of the roadmap ships, the whole thing will boot with one command:

```bash
docker compose up --build
```

Services: `db` (MySQL), `backend` (Express), `frontend` (nginx serving built React). Data persists in a named volume.

---

## Database Schema

Four tables — see `DB/init.sql` for the source of truth.

- **Users** — `UserID`, `Login` (unique), `Password_Hash`, `First_Name`, `Last_Name`
- **Boards** — `BoardID`, `UserID` (FK → Users), `Board_Title`
- **Lists** — `ListID`, `BoardID` (FK → Boards), `List_Title`, `Position`
- **Tasks** — `TaskID`, `ListID` (FK → Lists), `Task_Title`, `Task_Text`, `Position`

All foreign keys use `ON DELETE CASCADE` — delete a user and their entire board tree goes with them. Drag-and-drop ordering uses the `Position` column (unique within parent, managed by the app in a transaction).

Count tasks on a board (since tasks only know their list):
```sql
SELECT COUNT(*)
FROM Tasks t
JOIN Lists l ON t.ListID = l.ListID
WHERE l.BoardID = ?;
```

---

## API (in progress)

| Method | Route               | Purpose                                   |
|--------|---------------------|-------------------------------------------|
| GET    | `/api/health`       | liveness probe                            |
| GET    | `/api/boards`       | list boards                               |
| POST   | `/api/boards`       | create a board                            |
| GET    | `/api/boards/:id`   | get board + nested lists + tasks          |
| POST   | `/api/lists`        | create a list                             |
| PATCH  | `/api/lists/:id`    | rename or reorder a list                  |
| DELETE | `/api/lists/:id`    | delete a list (cascades to tasks)         |
| POST   | `/api/tasks`        | create a task                             |
| PATCH  | `/api/tasks/:id`    | edit, move between lists, reorder         |
| DELETE | `/api/tasks/:id`    | delete a task                             |

All write endpoints use parameterized SQL (`?` placeholders) — no string concatenation.

---

## Development Workflow

- Work through `ROADMAP.md` phase by phase. Don't jump ahead — each phase has a "how do I know it works" check.
- Commit early, commit often. Small commits > giant dumps.
- Never commit `.env`, `node_modules`, or `dist/`. `.gitignore` should already cover these.
- For destructive DB changes during dev: nuke the container / drop the db and re-run `DB/init.sql`. Real migrations come in the stretch goals.

---

## Ownership

| Area                                        | Owner  |
|---------------------------------------------|--------|
| Backend API, DB, Docker, VPS, domain, CI/CD | me     |
| Frontend UI, API integration, build config  | Claude |

---

## License

TBD.
