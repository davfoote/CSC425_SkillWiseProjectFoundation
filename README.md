# SkillWise — Project Foundation

SkillWise is a containerized learning platform focused on AI-assisted challenge creation, submission-based learning, and a peer-review workflow. This repository contains the frontend React app, backend API, database migrations, tests, and deployment tooling used in course projects and demonstrations.

This README is a concise project overview — for full documentation see the `docs/` folder linked below.

---

## Quick Links
- **Full Setup & Configuration:** `docs/SETUP.md`
- **Docker Guide:** `docs/DOCKER_SETUP.md`
- **Project Overview:** `docs/PROJECT_OVERVIEW.md`
- **User Stories & Tests:** `docs/USER_STORIES_IMPLEMENTATION.md` and `USER_STORY_7_TESTING_COMPLETE.md`

---

## Getting Started — Quick Start

Recommended: use Docker Compose to run the full stack (frontend + backend + DB + cache).

```powershell
# from repository root
git clone <repository-url>
cd CSC425_SkillWiseProjectFoundation
docker compose up --build

# run in background
docker compose up -d --build

# view combined logs
docker compose logs -f

# stop and remove
docker compose down
```

Service endpoints (local development):
- Frontend: `http://localhost:3000`
- Backend API: see `backend/.env` or `backend/config/server.js` (commonly `3001`)
- Postgres: `localhost:5432`

If you prefer not to use Docker, follow the manual development instructions in `docs/SETUP.md`.

---

## How to Run Locally (Manual)

Backend (API)

```powershell
cd backend
npm install
cp .env.example .env
# edit .env to point to your DB and secrets
npm run migrate
npm run seed
npm run dev
```

Frontend (React)

```powershell
cd frontend
npm install
# create frontend/.env as needed
npm start
```

---

## Tests

Run backend tests (Jest):

```powershell
cd backend
npm test
```

Run frontend tests or open Cypress for E2E:

```powershell
cd frontend
npm test
npm run cypress:open
```

---

## Repository Structure (high level)

- `backend/` — Node.js/Express API, migrations, services, controllers, tests
- `frontend/` — React single-page app, UI components, tests
- `database/` — SQL migration files and example data
- `docs/` — Detailed documentation: setup, API, DB diagrams, user story notes
- `cypress/` — E2E test specs and support files
- `scripts/` — helper scripts (migrate, seed, deploy)

Refer to `docs/PROJECT_STRUCTURE.md` for a deeper tree and file descriptions.

---

## Implemented Features (summary)

- Authentication (JWT + refresh tokens)
- Goal and Challenge management (CRUD)
- Progress tracking and dashboard endpoints
- Submission + Peer review workflows
- AI integration for challenge generation and feedback (OpenAI integration)
- Database migrations and seed scripts
- Unit, integration, and E2E tests (Jest + Cypress)
- Containerized development via Docker Compose

See `docs/USER_STORIES_IMPLEMENTATION.md` for feature-level details and status.

---

## Contributing

- Please read `CONTRIBUTING.md` (if present) and follow the repo `CODE_OF_CONDUCT`.
- Use branches named `feature/<short-description>` or `fix/<short-description>`.
- Run linters and tests locally before opening PRs.

If you'd like, I can add a `CONTRIBUTING.md` or a short script to standardize local development commands.

---

## Troubleshooting & Support

Common issues and resolutions are documented in `docs/SETUP.md` and `TESTING_GUIDE.md`.

If you hit environment-specific issues, check:
- `backend/.env` and `frontend/.env` for correct variables
- Docker containers status with `docker compose ps`

---

## Contact / Maintainers

Maintained by the course project team. For questions, open an issue or contact the repository owner.

---

License: see `LICENSE` (if included in repo) or add one as appropriate for your project.

