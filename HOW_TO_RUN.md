# How to Run SkillWise

## Quick Start (Easiest Method)

### 1. Start Backend Services (Database, Redis, Backend API)
```bash
cd /Users/emiliakubik/code/CSC425_SkillWiseProjectFoundation
docker-compose up -d
```

This starts:
- Backend API on port 3001
- PostgreSQL database on port 5432
- Redis on port 6379
- Frontend container on port 3000

### 2. Check if Everything is Running
```bash
docker-compose ps
```

You should see all containers with "healthy" or "Up" status.

### 3. Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Troubleshooting

### If Frontend Container Has Errors
Check logs:
```bash
docker-compose logs frontend
```

### If You Need to Install a Package in Docker
```bash
docker-compose exec frontend npm install <package-name>
docker-compose restart frontend
```

### If Port 3000 is Already in Use
Stop the containers and restart:
```bash
docker-compose down
docker-compose up -d
```

### To Stop Everything
```bash
docker-compose down
```

### To Rebuild After Code Changes
```bash
docker-compose down
docker-compose up -d --build
```

## Important Notes

- **OpenAI API Key**: Stored in `backend/.env` (NOT committed to git)
- **Branch**: EmiliaKubik-Sprint3
- **Database**: PostgreSQL with Prisma ORM
- All styling uses inline styles with colorful gradients (blue, yellow, green, purple, pink)
- Frontend runs in Docker container automatically when you run `docker-compose up -d`

## Design System Reference
- Backgrounds: Blue gradients (#38bdf8→#60a5fa→#93c5fd)
- Headers: Yellow/gold gradients (#fef3c7→#fbbf24)
- Buttons: Green (#34d399→#059669), Purple (#a78bfa→#7c3aed), Pink (#f472b6→#db2777)
- Border radius: 16-32px
- Emojis throughout for fun visual elements
