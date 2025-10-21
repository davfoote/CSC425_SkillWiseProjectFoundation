# SkillWise Project Foundation

A containerized learning platform with AI-powered challenges and peer review system.

## Quick Start with Docker 🐳

Get the entire application stack running with one command:

```bash
# Clone and start the application
git clone <repository-url>
cd CSC425_SkillWiseProjectFoundation
docker compose up --build
```

**Services Available:**
- 🌐 **Frontend**: http://localhost:3000 (React)
- 🔧 **Backend API**: http://localhost:5000 (Node.js/Express)
- 🗄️ **Database**: PostgreSQL on port 5432
- 🔄 **Redis Cache**: Port 6379

For detailed Docker setup instructions, see [DOCKER_SETUP.md](docs/DOCKER_SETUP.md)

## Technology Stack

- **Node.js (LTS)** with Express.js
- **React** frontend with modern hooks
- **PostgreSQL** database with Docker
- **Redis** for caching and sessions
- **JWT** authentication with httpOnly cookies
- **bcrypt** for password hashing
- **Zod** for request validation
- **pino** for logging
- **Docker** for containerized development

## Project Structure

```
CSC425_SkillWiseProjectFoundation/
├── docker-compose.yml          # 🐳 Multi-service container orchestration
├── frontend/                   # React application
│   ├── Dockerfile.dev         # Frontend container configuration
│   ├── package.json
│   └── src/
├── backend/                    # Node.js API server
│   ├── Dockerfile.dev         # Backend container configuration
│   ├── .env.docker           # Container environment variables
│   ├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── goalController.js
│   │   ├── challengeController.js
│   │   ├── progressController.js
│   │   ├── submissionController.js
│   │   ├── aiController.js
│   │   ├── peerReviewController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── logger.js
│   │   └── cors.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Goal.js
│   │   ├── Challenge.js
│   │   ├── Progress.js
│   │   ├── Submission.js
│   │   ├── AIFeedback.js
│   │   ├── PeerReview.js
│   │   └── Leaderboard.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── goals.js
│   │   ├── challenges.js
│   │   ├── progress.js
│   │   ├── submissions.js
│   │   ├── ai.js
│   │   ├── reviews.js
│   │   └── leaderboard.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── goalService.js
│   │   ├── challengeService.js
│   │   ├── progressService.js
│   │   ├── aiService.js
│   │   ├── emailService.js
│   │   └── leaderboardService.js
│   ├── database/
│   │   ├── connection.js
│   │   ├── migrations/
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_goals.sql
│   │   │   ├── 003_create_challenges.sql
│   │   │   ├── 004_create_progress.sql
│   │   │   ├── 005_create_submissions.sql
│   │   │   ├── 006_create_ai_feedback.sql
│   │   │   ├── 007_create_peer_reviews.sql
│   │   │   └── 008_create_leaderboard.sql
│   │   └── seeds/
│   │       ├── users.js
│   │       ├── goals.js
│   │       └── challenges.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── errors.js
│   ├── config/
│   │   ├── database.js
│   │   ├── auth.js
│   │   ├── ai.js
│   │   └── server.js
│   └── app.js
├── tests/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── goals.test.js
│   │   ├── challenges.test.js
│   │   └── ai.test.js
│   └── fixtures/
│       ├── users.json
│       ├── goals.json
│       └── challenges.json
├── docs/
│   ├── api/
│   │   ├── swagger.yaml
│   │   └── endpoints.md
│   └── database/
│       ├── schema.md
│       └── relationships.md
├── scripts/
│   ├── migrate.js
│   ├── seed.js
│   └── deploy.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── server.js
└── README.md
```

## Development Setup

### Option 1: Docker (Recommended) 🐳

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

**Start Development:**
```bash
# Start all services
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Option 2: Local Development

**Prerequisites:**
- Node.js 18+ and npm
- PostgreSQL 15+ installed locally

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

## Implemented Features ✅

**User Stories Completed:**
- ✅ User Story 1: Authentication System (JWT + bcrypt)
- ✅ User Story 2: Goal Management (CRUD operations)
- ✅ User Story 3: Progress Tracking (Milestones + timeline)
- ✅ User Story 4: Challenge System (Manual + AI generation)
- ✅ User Story 5: AI Integration (OpenAI API)
- ✅ User Story 6: Database Schema (PostgreSQL + migrations)
- ✅ User Story 7: Authentication Testing (Comprehensive test suite)
- ✅ User Story 8: Containerized Environment (Docker + Compose)

For detailed implementation status, see [docs/USER_STORIES_IMPLEMENTATION.md](docs/USER_STORIES_IMPLEMENTATION.md)

## Documentation 📚

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Setup Instructions](docs/SETUP.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Endpoints](docs/api/API_ENDPOINTS.md)
- [Docker Setup Guide](docs/DOCKER_SETUP.md)
- [User Stories Implementation](docs/USER_STORIES_IMPLEMENTATION.md)

## API Endpoints Structure

### Authentication Routes (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Goals Routes (`/api/goals`)

- `GET /` - Get user's goals
- `POST /` - Create new goal
- `GET /:id` - Get specific goal
- `PUT /:id` - Update goal
- `DELETE /:id` - Delete goal

### Challenges Routes (`/api/challenges`)

- `GET /` - Get challenges for a goal
- `POST /` - Create new challenge
- `GET /:id` - Get specific challenge
- `PUT /:id` - Update challenge
- `DELETE /:id` - Delete challenge

### Progress Routes (`/api/progress`)

- `GET /goals/:goalId` - Get progress for a goal
- `POST /` - Update progress
- `GET /dashboard` - Get dashboard data

### Submissions Routes (`/api/submissions`)

- `POST /` - Submit work for challenge
- `GET /challenge/:challengeId` - Get submissions for challenge
- `GET /:id` - Get specific submission
- `PUT /:id/review` - Add peer review

### AI Routes (`/api/ai`)

- `POST /generate-challenges` - Generate challenges for goal
- `POST /feedback` - Get AI feedback on submission
- `POST /explain` - Get explanation for concept

### Leaderboard Routes (`/api/leaderboard`)

- `GET /` - Get leaderboard data
- `GET /user/:userId` - Get user ranking

## Database Schema Design

### Core Tables

- **users** - User authentication and profile data
- **refresh_tokens** - JWT refresh token storage
- **goals** - Learning goals with timelines
- **challenges** - Individual challenges within goals
- **progress** - User progress tracking
- **submissions** - User work submissions
- **ai_feedback** - AI-generated feedback
- **peer_reviews** - Peer review data
- **leaderboard** - User rankings and scores

## Key Features to Implement

### Authentication System

- JWT access/refresh token pattern
- Password hashing with bcrypt
- httpOnly cookie security
- Rate limiting on auth endpoints

### Goal Management

- CRUD operations for learning goals
- Timeline and milestone tracking
- Goal categorization and tagging

### Challenge System

- Manual challenge creation
- AI-generated challenges
- Submission tracking and validation

### AI Integration

- OpenAI API integration
- Prompt template management
- Rate limiting and error handling
- Response caching

### Progress Tracking

- Milestone completion tracking
- Progress percentage calculation
- Activity timeline

### Peer Review System

- Review assignment logic
- Rating and feedback system
- Review quality scoring

### Leaderboard

- Point calculation system
- Ranking algorithms
- Achievement badges

## Security Considerations

- Input validation with Zod
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Environment variable management

## Testing Strategy

- Unit tests for services and utilities
- Integration tests for API endpoints
- Database transaction testing
- AI service mocking
- Authentication flow testing

## Logging and Monitoring

- Structured logging with pino
- Error tracking and alerting
- Performance monitoring
- API usage analytics
