# KanBan — Step-by-Step Roadmap (Junior Edition)

> Goal: finish the backend, containerize everything, put it on a real server, ship it on my own domain.
> DB is **MySQL** (chose it for school coursework).
> Rule of thumb: never jump to the next phase until the "how do i know it works" check for the current one passes.

---

## Phase 1 — Backend Foundations

> current state: `Backend/src/index.js` has an Express app that just serves static files. `db.js` imports `mysql2` and does nothing else. no routes, no db connection. we'll build it piece by piece.

### 1.1 Project hygiene

- [X] confirm `Backend/package.json` has: `express`, `mysql2`, `dotenv`, `cors`; devDep: `nodemon`
- [X] add `"dev": "nodemon src/index.js"` and `"start": "node src/index.js"` scripts
- [X] make sure `"type": "module"` is set (we're using `import` syntax, not `require`)
- [ ] create `Backend/.env.example` (committed, no real values) and `Backend/.env` (gitignored, real values)
  - vars you'll need: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- [X] verify `.env` is in `.gitignore`

**check:** `npm run dev` still starts the server on port 4000, no crash.

**learn:** what `package.json` scripts are, why `.env` exists (secrets out of code), what nodemon does (restarts on save).

### 1.2 Load env vars at startup

- [X] import `dotenv/config` at the very top of `src/index.js` (before anything that reads env)
- [X] replace the hardcoded `PORT = 4000` with `process.env.PORT ?? 4000`

**check:** change `PORT=5000` in `.env`, restart, server listens on 5000.

**learn:** `process.env`, why env-driven config matters for deploy later.

---

## Phase 2 — Connect Backend to MySQL

> this is the part u said u don't get. the mental model: your node app opens a **connection pool** (a bunch of reusable sockets to the db), and every request borrows one, runs SQL, returns it to the pool.

### 2.1 Get MySQL running locally

- [x] install MySQL locally (brew on mac: `brew install mysql` then `brew services start mysql`) — OR skip local install and wait until Phase 5 when docker gives u one; up to u
- [x] run the `DB/init.sql` script against ur local MySQL (`mysql -u root -p < DB/init.sql`)
- [X] create a dedicated db user for the app (don't use `root` from the app). grant it privileges on the `KanBan` db only.
- [X] put that user + password into `Backend/.env`

**check:** `mysql -u <app_user> -p KanBan -e "SHOW TABLES;"` lists Users, Boards, Lists, Tasks.

**learn:** mysql CLI basics, users & grants, why apps shouldn't login as root.

### 2.2 Build a real `db.js`

- [x] in `Backend/src/db.js`, use `mysql2/promise` (not the callback version — promises play nicer with async/await)
- [x] create a **connection pool** using `mysql.createPool({...})` reading host/user/password/database/port from `process.env`
- [x] export the pool as the default export
- [x] add a tiny "ping" function that runs `SELECT 1` and logs success/failure

**check:** import that ping into `index.js`, call it on startup; `npm run dev` logs "db ok". kill mysql, restart backend, it should log a clear error (not crash silently).

**learn:** connection pools vs single connections, callbacks vs promises, why `SELECT 1` is the universal "is it alive" query.

### 2.3 Write your first real query

- [X] make a quick throwaway route `GET /api/debug/users` that `SELECT *`s from Users and returns JSON
- [X] hit it with `curl http://localhost:4000/api/debug/users`
- [X] insert one row manually via mysql CLI, re-hit the endpoint, see the row
**check:** endpoint returns an array of users as JSON.

**learn:** parameterized queries (`?` placeholders) — NEVER concatenate strings into SQL (that's how SQL injection happens). remove the debug route when done.

---

## Phase 3 — Build the REST API

> REST = a convention for http endpoints. GET reads, POST creates, PATCH edits, DELETE deletes. urls name resources (`/api/boards/42`), not actions (`/api/getBoard?id=42`).

### 3.1 Folder structure

- [x] make `Backend/src/routes/` and `Backend/src/controllers/`
- [ ] rule: **routes** = URL → controller function mapping. **controllers** = the actual logic (talk to db, return json). keeps index.js clean.
- [x] add `app.use(express.json())` in index.js so req bodies get parsed

### 3.2 Endpoints to build (in this order — easier → harder)

do each one = route + controller + test with curl before moving on.

- [ ] `GET /api/health` → returns `{ status: "ok" }`. trivial, but u'll need it later for monitoring.
- [ ] `GET /api/boards` → list all boards (later: filter by user)
- [ ] `POST /api/boards` → create a board (body: `{ title, userId }`)
- [ ] `GET /api/boards/:id` → return the board PLUS its lists PLUS each list's tasks, nested. this one's chunky — probably 3 queries or 1 join.
- [ ] `POST /api/lists` → create a list in a board
- [ ] `PATCH /api/lists/:id` → rename a list / change its position
- [ ] `DELETE /api/lists/:id` → delete (cascade handles tasks bc of FK)
- [ ] `POST /api/tasks` → create a task in a list
- [ ] `PATCH /api/tasks/:id` → edit title/text or move (change list_id + position)
- [ ] `DELETE /api/tasks/:id` → delete

**check per endpoint:** hit it with curl or Postman, verify the db row changes as expected via mysql CLI.

### 3.3 Basic validation + errors

- [ ] for each POST/PATCH, verify required fields exist in the body; return `400` with a message if not
- [ ] wrap controllers in try/catch — on error, return `500` and log the real error server-side (don't leak stack traces to the client)
- [ ] add a global error-handling middleware at the end of `index.js`

**check:** sending an empty POST body returns 400, not a crash.

### 3.4 CORS

- [ ] add the `cors` middleware, allow the frontend origin (`http://localhost:5173` in dev)

**check:** frontend can fetch `/api/health` from the browser without a CORS error.

**learn in this phase:** REST, express routing, middleware order (matters!), status codes, parameterized SQL, CORS.

---

## Phase 4 — Frontend Integration

> mostly Claude's job. your job: review the PR, understand the patterns.

- [ ] (Claude) add an API client using `fetch`, base URL from env
- [ ] (Claude) replace any mock data with real API calls
- [ ] (Claude) wire drag-and-drop to PATCH endpoints so moves persist
- [ ] (Claude) loading + error states in the UI

**check:** full flow — create board → add list → add task → drag task → refresh page → state persisted.

---

## Phase 5 — Docker

> containers = "ship my app + all its dependencies as one sealed box." docker-compose = "run several boxes together and let them talk."

### 5.1 Backend Dockerfile

- [ ] base image: `node:20-alpine` (alpine = tiny)
- [ ] copy `package*.json`, run `npm ci`, then copy source — this ordering leverages docker's layer cache so code edits don't reinstall deps
- [ ] `EXPOSE` the backend port, set `CMD ["node", "src/index.js"]`

**check:** `docker build -t kanban-backend ./Backend` succeeds, `docker run` it with env vars and it logs "listening".

### 5.2 Frontend Dockerfile (multi-stage)

- [ ] stage 1: `node:20-alpine` — `npm ci && npm run build` → produces `dist/`
- [ ] stage 2: `nginx:alpine` — copy `dist/` into `/usr/share/nginx/html/`
- [ ] add a tiny nginx config that proxies `/api/*` to the backend service (or keep them separate and let frontend hit backend by hostname)

**learn:** why multi-stage (build tools don't ship to prod → smaller, safer image).

### 5.3 docker-compose.yml

- [ ] three services: `db` (mysql:8), `backend`, `frontend`
- [ ] `db`: named volume mounted at `/var/lib/mysql` (so data survives restarts); env vars `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- [ ] mount `DB/init.sql` into `/docker-entrypoint-initdb.d/` — mysql auto-runs it on first boot
- [ ] `backend` `depends_on: [db]`; talks to db using hostname `db` (compose handles DNS between services)
- [ ] `frontend` `depends_on: [backend]`; only frontend exposes a port to the host
- [ ] use an `.env` file next to compose for secrets

**check:** `docker compose up --build`, visit `http://localhost`, app works end-to-end. `docker compose down` then `up` again — data is still there (volume worked).

**learn:** Dockerfiles, layer caching, multi-stage builds, compose networking, named volumes, init scripts.

---

## Phase 6 — Server & Domain

### 6.1 Pick a VPS

- [ ] Hetzner (cheap, good), DigitalOcean (docs), or Contabo (stupidly cheap) — any ~5€/mo box is fine
- [ ] pick Ubuntu 24.04 LTS for sanity

### 6.2 Harden the box (first 20 min on any new server)

- [ ] create a non-root user, add your SSH public key to it
- [ ] disable root SSH login + disable password auth (keys only) in `/etc/ssh/sshd_config`
- [ ] install + enable `ufw`: allow 22, 80, 443 only
- [ ] install `fail2ban` (bans IPs hammering SSH)

**check:** u can SSH in as non-root with ur key; password login refused; `ufw status` shows only 22/80/443.

### 6.3 Install Docker on the server

- [ ] follow docker's official "Install Docker Engine on Ubuntu" guide — don't use random blog instructions, they go stale

### 6.4 Domain + DNS

- [ ] buy a domain (namecheap, porkbun, cloudflare registrar — cloudflare's the cheapest if u plan to use their DNS)
- [ ] at ur registrar's DNS panel, add an **A record**: `@` → VPS IP, TTL low (300s) while testing
- [ ] wait for DNS to propagate (`dig yourdomain.com` from ur laptop should show the VPS IP)

### 6.5 Reverse proxy + HTTPS

- [ ] use **Caddy** — it auto-provisions Let's Encrypt certs with ~3 lines of config. nginx+certbot works too but more manual steps.
- [ ] Caddyfile tells Caddy: "for yourdomain.com, reverse_proxy to the frontend container"
- [ ] run Caddy as a fourth service in compose, binding 80/443 on the host
- [ ] backend + db are NOT exposed to the host — only Caddy is

**check:** `https://yourdomain.com` loads with a valid padlock. `curl -I http://yourdomain.com` returns a 308 redirect to https.

**learn:** Linux user mgmt, SSH hardening, ufw, DNS records, reverse proxies, how TLS certs are actually issued.

---

## Phase 7 — Deploy Pipeline

> goal: `git push` and prod updates itself. start dumb, graduate later.

### 7.1 Manual deploy first

- [ ] on the server, clone the repo, create `.env.production`, `docker compose up -d --build`
- [ ] practice the whole loop: change code locally → push → SSH in → `git pull` → `docker compose up -d --build`
- [ ] do this ~3 times. feel the pain. THEN automate.

### 7.2 Automate with GitHub Actions

- [ ] workflow on push to `master`:
  1. checkout, install, lint, build (fails fast if code broken)
  2. build docker images
  3. push images to GHCR (GitHub Container Registry — free for public repos)
  4. SSH into VPS (using a deploy key stored in repo secrets), `docker compose pull && docker compose up -d`
- [ ] repo secrets u'll need: `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`, registry token

**check:** push a trivial change to master, grab a coffee, come back, change is live on the domain.

**learn:** CI/CD, YAML workflow syntax, secret management, container registries, ssh-based deploys.

---

## Phase 8 — Production Hygiene

don't skip this or u'll regret it the first time something breaks.

- [ ] nightly `mysqldump` cron, uploaded to S3-compatible storage (backblaze b2 is cheapest); test that u can actually restore from it
- [ ] structured logs — add `pino` in backend; access them with `docker compose logs backend`
- [ ] uptime monitor — UptimeRobot free tier pings `/api/health` every 5min, emails u on failure
- [ ] `helmet` middleware in express (sets security headers)
- [ ] rate limiting (`express-rate-limit`) on auth/write endpoints
- [ ] `logrotate` or docker's `max-size` log driver so logs don't eat the disk

---

## Stretch (only after everything above is solid)

- [ ] user auth (JWT or sessions) — currently Users table exists but no login flow
- [ ] staging subdomain (`staging.yourdomain.com`) pointing at a separate compose stack
- [ ] migrations tool (`knex` migrate or `dbmate`) so schema changes aren't "ssh in and run sql"
- [ ] Terraform or Ansible for the VPS, so u can rebuild it from scratch in 10min
- [ ] WebSockets for real-time multi-user board updates

---

## Ownership

| Area | Owner |
|------|-------|
| Backend, DB, Docker, server, domain, CI/CD | me |
| Frontend UI, API integration, build config | Claude |

---

## DB Design Notes (reference)

1. Users: UserID, Login, Password_Hash, First_Name, Last_Name
2. Boards: BoardID, UserID, Board_Title
3. Lists: ListID, BoardID, List_Title, Position
4. Tasks: TaskID, ListID, Task_Title, Task_Text, Position

- drag & drop uses `Position` — simplest: on reorder, update the moved row's position and shift siblings. fancier: sparse integers (10, 20, 30...) so u can insert between without re-numbering everything.
- password hashing: bcrypt or argon2 at signup, store only the hash. never the plaintext. never md5/sha1.
- task count per board: join Lists→Tasks, group by BoardID (see the query at the bottom of `init.sql`).


Implement vidjet like feature 