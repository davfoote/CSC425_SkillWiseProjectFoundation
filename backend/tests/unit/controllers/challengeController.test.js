const request = require('supertest');
const app = require('../../../src/app');
const challengeController = require('../../../src/controllers/challengeController');
const Challenge = require('../../../src/models/Challenge');

// Mock the Challenge model
jest.mock('../../../src/models/Challenge');

describe('Challenge Controller', () => {
  let mockUser;
  let mockGoal;
  let authCookies;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create test user and get auth token
    const userCredentials = {
      firstName: 'Challenge',
      lastName: 'Tester',
      email: `challengetest-${Date.now()}@example.com`,
      password: 'ChallengeTest123',
      confirmPassword: 'ChallengeTest123'
    };

    await request(app)
      .post('/api/auth/signup')
      .send(userCredentials);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password
      });

    authCookies = loginResponse.get('Set-Cookie');
    mockUser = loginResponse.body.user;
  });

  describe('GET /api/challenges', () => {
    it('should return all challenges with default filters', async () => {
      const mockChallenges = [
        {
          id: 1,
          title: 'Build a Calculator',
          description: 'Create a basic calculator app',
          category: 'programming',
          difficulty: 'easy',
          points: 100,
          timeLimit: 60,
          status: 'active',
          createdAt: new Date()
        },
        {
          id: 2,
          title: 'Design a Logo',
          description: 'Create a professional logo',
          category: 'design',
          difficulty: 'medium',
          points: 150,
          timeLimit: 120,
          status: 'active',
          createdAt: new Date()
        }
      ];

      Challenge.findAll = jest.fn().mockResolvedValue(mockChallenges);

      const response = await request(app)
        .get('/api/challenges')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.challenges).toHaveLength(2);
      expect(response.body.challenges[0]).toMatchObject({
        title: 'Build a Calculator',
        category: 'programming',
        difficulty: 'easy'
      });
      expect(Challenge.findAll).toHaveBeenCalledWith({});
    });

    it('should filter challenges by category', async () => {
      const mockChallenges = [
        {
          id: 1,
          title: 'React Component',
          category: 'programming',
          difficulty: 'medium',
          points: 200
        }
      ];

      Challenge.findAll = jest.fn().mockResolvedValue(mockChallenges);

      const response = await request(app)
        .get('/api/challenges?category=programming')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.challenges).toHaveLength(1);
      expect(Challenge.findAll).toHaveBeenCalledWith({
        category: 'programming'
      });
    });

    it('should filter challenges by difficulty', async () => {
      const mockChallenges = [
        {
          id: 2,
          title: 'Advanced Algorithm',
          category: 'programming',
          difficulty: 'hard',
          points: 500
        }
      ];

      Challenge.findAll = jest.fn().mockResolvedValue(mockChallenges);

      const response = await request(app)
        .get('/api/challenges?difficulty=hard')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.challenges).toHaveLength(1);
      expect(Challenge.findAll).toHaveBeenCalledWith({
        difficulty: 'hard'
      });
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/challenges')
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });

  describe('GET /api/challenges/:id', () => {
    it('should return specific challenge details', async () => {
      const challengeId = 1;
      const mockChallenge = {
        id: challengeId,
        title: 'Build a To-Do App',
        description: 'Create a full-featured to-do application with CRUD operations',
        category: 'programming',
        difficulty: 'medium',
        points: 250,
        timeLimit: 180,
        requirements: ['React', 'Node.js', 'Database'],
        status: 'active',
        createdAt: new Date()
      };

      Challenge.findById = jest.fn().mockResolvedValue(mockChallenge);

      const response = await request(app)
        .get(`/api/challenges/${challengeId}`)
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.challenge).toMatchObject({
        title: 'Build a To-Do App',
        category: 'programming',
        difficulty: 'medium',
        points: 250
      });
      expect(Challenge.findById).toHaveBeenCalledWith(challengeId);
    });

    it('should return 404 for non-existent challenge', async () => {
      const challengeId = 999;

      Challenge.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/challenges/${challengeId}`)
        .set('Cookie', authCookies)
        .expect(404);

      expect(response.body.message).toBe('Challenge not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/challenges/1')
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });

  describe('POST /api/challenges/:id/start', () => {
    it('should start a challenge for the user', async () => {
      const challengeId = 1;
      const mockChallenge = {
        id: challengeId,
        title: 'Build a Calculator',
        difficulty: 'easy',
        timeLimit: 60
      };

      const mockStartedChallenge = {
        id: 1,
        challengeId: challengeId,
        userId: mockUser.id,
        status: 'in_progress',
        startedAt: new Date()
      };

      Challenge.findById = jest.fn().mockResolvedValue(mockChallenge);
      Challenge.startForUser = jest.fn().mockResolvedValue(mockStartedChallenge);

      const response = await request(app)
        .post(`/api/challenges/${challengeId}/start`)
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.message).toBe('Challenge started successfully');
      expect(response.body.userChallenge.status).toBe('in_progress');
      expect(Challenge.startForUser).toHaveBeenCalledWith(challengeId, mockUser.id);
    });

    it('should return 404 for non-existent challenge', async () => {
      const challengeId = 999;

      Challenge.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/challenges/${challengeId}/start`)
        .set('Cookie', authCookies)
        .expect(404);

      expect(response.body.message).toBe('Challenge not found');
    });

    it('should prevent starting already completed challenge', async () => {
      const challengeId = 1;
      const mockChallenge = {
        id: challengeId,
        title: 'Build a Calculator'
      };

      Challenge.findById = jest.fn().mockResolvedValue(mockChallenge);
      Challenge.startForUser = jest.fn().mockRejectedValue(new Error('Challenge already completed'));

      const response = await request(app)
        .post(`/api/challenges/${challengeId}/start`)
        .set('Cookie', authCookies)
        .expect(400);

      expect(response.body.message).toContain('Challenge already completed');
    });
  });

  describe('POST /api/challenges/:id/complete', () => {
    it('should complete a challenge with submission', async () => {
      const challengeId = 1;
      const submissionData = {
        submissionUrl: 'https://github.com/user/calculator-app',
        notes: 'Completed with React and CSS'
      };

      const mockCompletedChallenge = {
        id: 1,
        challengeId: challengeId,
        userId: mockUser.id,
        status: 'completed',
        completedAt: new Date(),
        submissionUrl: submissionData.submissionUrl,
        notes: submissionData.notes
      };

      Challenge.completeForUser = jest.fn().mockResolvedValue(mockCompletedChallenge);

      const response = await request(app)
        .post(`/api/challenges/${challengeId}/complete`)
        .set('Cookie', authCookies)
        .send(submissionData)
        .expect(200);

      expect(response.body.message).toBe('Challenge completed successfully');
      expect(response.body.userChallenge.status).toBe('completed');
      expect(Challenge.completeForUser).toHaveBeenCalledWith(
        challengeId, 
        mockUser.id, 
        submissionData
      );
    });

    it('should require submission URL', async () => {
      const challengeId = 1;
      const invalidData = {
        notes: 'Missing submission URL'
      };

      const response = await request(app)
        .post(`/api/challenges/${challengeId}/complete`)
        .set('Cookie', authCookies)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Submission URL is required');
    });

    it('should validate submission URL format', async () => {
      const challengeId = 1;
      const invalidData = {
        submissionUrl: 'invalid-url',
        notes: 'Invalid URL format'
      };

      const response = await request(app)
        .post(`/api/challenges/${challengeId}/complete`)
        .set('Cookie', authCookies)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Invalid URL format');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/challenges/1/complete')
        .send({
          submissionUrl: 'https://github.com/user/project',
          notes: 'Completed'
        })
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });

  describe('GET /api/challenges/user/progress', () => {
    it('should return user challenge progress', async () => {
      const mockProgress = {
        totalChallenges: 10,
        completedChallenges: 3,
        inProgressChallenges: 2,
        totalPoints: 750,
        completionRate: 30,
        challengesByCategory: {
          programming: { completed: 2, total: 5 },
          design: { completed: 1, total: 3 }
        }
      };

      Challenge.getUserProgress = jest.fn().mockResolvedValue(mockProgress);

      const response = await request(app)
        .get('/api/challenges/user/progress')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.progress).toMatchObject(mockProgress);
      expect(Challenge.getUserProgress).toHaveBeenCalledWith(mockUser.id);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/challenges/user/progress')
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });
});