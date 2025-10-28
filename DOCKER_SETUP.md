# SkillWise Docker Development Environment

## Quick Start

### Prerequisites
- Docker Desktop installed
- Git installed

### Installation

1. **Install Docker Desktop:**
   - **macOS**: Download from [docker.com](https://www.docker.com/products/docker-desktop/) or `brew install --cask docker`
   - **Windows**: Download Docker Desktop for Windows
   - **Linux**: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`

2. **Clone and Start:**
   ```bash
   git clone <your-repo-url>
   cd CSC425_SkillWiseProjectFoundation
   docker compose up --build
   ```

### Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (skillwise_user/skillwise_pass)

### Common Commands
```bash
# Start services
docker compose up --build

# Stop services
docker compose down

# View logs
docker compose logs backend
docker compose logs frontend

# Run tests
docker compose exec backend npm test

# Access database
docker compose exec database psql -U skillwise_user -d skillwise_db
```

### Development Workflow
1. Start containers: `docker compose up --build`
2. Make code changes (auto-reloads)
3. Test your changes
4. Commit and push

For detailed documentation, see [USER_STORY_8_COMPLETION.md](docs/USER_STORY_8_COMPLETION.md)