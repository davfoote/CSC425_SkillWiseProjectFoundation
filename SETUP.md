# SkillWise — Quick Setup

This quick `SETUP.md` gives the minimal steps to get the project running locally. For complete, detailed setup (env files, full Docker-compose reference, scripts, test configuration, and troubleshooting) see `docs/SETUP.md`.

## Prerequisites
- Node.js (v18+)
- npm (comes with Node) or yarn
- Docker & Docker Desktop (includes Docker Compose)
- Git

## Quick Start — Recommended (Docker)
Start the full development environment (database, backend, frontend):

```powershell
# from repository root
docker-compose up -d

# view logs
docker-compose logs -f

# stop and remove containers
docker-compose down
```

Notes:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Database (Postgres): localhost:5432

## Quick Start — Manual (no Docker)
1. Backend

```powershell
cd backend
npm install
# create a local .env (see docs/SETUP.md for example)
npm run dev
```

2. Frontend

```powershell
cd frontend
npm install
# create frontend/.env (see docs/SETUP.md for example)
npm start
```

## Testing
- Backend unit/integration (Jest):

```powershell
cd backend
npm test
```

- Frontend (React Testing Library / Cypress):

```powershell
cd frontend
npm test
# or E2E
npm run cypress:open
```

## Environment files
- See `docs/SETUP.md` for full `.env` templates for `backend/.env` and `frontend/.env`.

## Useful commands
- Rebuild Docker images:

```powershell
docker-compose build --no-cache
docker-compose up -d
```

- Reset local Docker DB:

```powershell
docker-compose down -v
docker-compose up -d database
```

## Where to find more
- Full and detailed setup, env examples, scripts, migrations, testing notes, and troubleshooting: `docs/SETUP.md`.

If you'd like, I can also:
- add a short `Makefile` or PowerShell scripts for common commands,
- or update CI configs to reference these quickstart steps. Tell me which you'd prefer.
