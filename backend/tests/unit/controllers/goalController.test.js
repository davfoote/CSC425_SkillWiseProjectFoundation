const request = require('supertest');
const app = require('../../../src/app');
const goalController = require('../../../src/controllers/goalController');
const Goal = require('../../../src/models/Goal');
const Progress = require('../../../src/models/Progress');

// Mock the Goal and Progress models
jest.mock('../../../src/models/Goal');
jest.mock('../../../src/models/Progress');

describe('Goal Controller', () => {
  let mockUser;
  let mockToken;
  let authCookies;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create test user and get auth token
    const userCredentials = {
      firstName: 'Goal',
      lastName: 'Tester',
      email: `goaltest-${Date.now()}@example.com`,
      password: 'GoalTest123',
      confirmPassword: 'GoalTest123',
    };

    await request(app)
      .post('/api/auth/signup')
      .send(userCredentials);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      });

    authCookies = loginResponse.get('Set-Cookie');
    mockUser = loginResponse.body.user;
  });

  describe('GET /api/goals', () => {
    it('should return user goals with progress', async () => {
      const mockGoals = [
        {
          id: 1,
          title: 'Learn React',
          description: 'Master React fundamentals',
          category: 'programming',
          difficulty: 'medium',
          estimatedHours: 40,
          userId: mockUser.id,
          status: 'in_progress',
          createdAt: new Date(),
          progress: 60,
        },
        {
          id: 2,
          title: 'Complete Portfolio',
          description: 'Build a professional portfolio',
          category: 'career',
          difficulty: 'high',
          estimatedHours: 60,
          userId: mockUser.id,
          status: 'not_started',
          createdAt: new Date(),
          progress: 0,
        },
      ];

      Goal.findByUserId = jest.fn().mockResolvedValue(mockGoals);

      const response = await request(app)
        .get('/api/goals')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.goals).toHaveLength(2);
      expect(response.body.goals[0]).toMatchObject({
        title: 'Learn React',
        progress: 60,
        status: 'in_progress',
      });
      expect(Goal.findByUserId).toHaveBeenCalledWith(mockUser.id);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/goals')
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });

    it('should handle empty goals list', async () => {
      Goal.findByUserId = jest.fn().mockResolvedValue([]);

      const response = await request(app)
        .get('/api/goals')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.goals).toEqual([]);
      expect(response.body.message).toBe('Goals retrieved successfully');
    });
  });

  describe('POST /api/goals', () => {
    it('should create a new goal with valid data', async () => {
      const goalData = {
        title: 'Master JavaScript',
        description: 'Learn advanced JavaScript concepts',
        category: 'programming',
        difficulty: 'high',
        estimatedHours: 80,
      };

      const mockCreatedGoal = {
        id: 3,
        ...goalData,
        userId: mockUser.id,
        status: 'not_started',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      Goal.create = jest.fn().mockResolvedValue(mockCreatedGoal);

      const response = await request(app)
        .post('/api/goals')
        .set('Cookie', authCookies)
        .send(goalData)
        .expect(201);

      expect(response.body.message).toBe('Goal created successfully');
      expect(response.body.goal).toMatchObject({
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        difficulty: goalData.difficulty,
        estimatedHours: goalData.estimatedHours,
        status: 'not_started',
      });

      expect(Goal.create).toHaveBeenCalledWith({
        ...goalData,
        userId: mockUser.id,
      });
    });

    it('should require authentication', async () => {
      const goalData = {
        title: 'Test Goal',
        description: 'Test Description',
        category: 'test',
        difficulty: 'easy',
        estimatedHours: 10,
      };

      const response = await request(app)
        .post('/api/goals')
        .send(goalData)
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        description: 'Missing title',
        category: 'test',
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Cookie', authCookies)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Validation error');
    });

    it('should validate difficulty values', async () => {
      const invalidData = {
        title: 'Test Goal',
        description: 'Test Description',
        category: 'test',
        difficulty: 'invalid_difficulty',
        estimatedHours: 10,
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Cookie', authCookies)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Invalid difficulty level');
    });

    it('should validate estimated hours', async () => {
      const invalidData = {
        title: 'Test Goal',
        description: 'Test Description',
        category: 'test',
        difficulty: 'easy',
        estimatedHours: -5,
      };

      const response = await request(app)
        .post('/api/goals')
        .set('Cookie', authCookies)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toContain('Estimated hours must be positive');
    });
  });

  describe('PUT /api/goals/:id', () => {
    it('should update existing goal', async () => {
      const goalId = 1;
      const updateData = {
        title: 'Updated Goal Title',
        description: 'Updated description',
        status: 'in_progress',
      };

      const mockUpdatedGoal = {
        id: goalId,
        ...updateData,
        userId: mockUser.id,
        category: 'programming',
        difficulty: 'medium',
        estimatedHours: 40,
        updatedAt: new Date(),
      };

      Goal.update = jest.fn().mockResolvedValue(mockUpdatedGoal);
      Goal.findByIdAndUserId = jest.fn().mockResolvedValue(mockUpdatedGoal);

      const response = await request(app)
        .put(`/api/goals/${goalId}`)
        .set('Cookie', authCookies)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Goal updated successfully');
      expect(response.body.goal.title).toBe(updateData.title);
      expect(Goal.update).toHaveBeenCalledWith(goalId, mockUser.id, updateData);
    });

    it('should return 404 for non-existent goal', async () => {
      const goalId = 999;
      const updateData = {
        title: 'Updated Title',
      };

      Goal.update = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/goals/${goalId}`)
        .set('Cookie', authCookies)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Goal not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/goals/1')
        .send({ title: 'Updated' })
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });

  describe('DELETE /api/goals/:id', () => {
    it('should delete existing goal', async () => {
      const goalId = 1;

      Goal.delete = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .delete(`/api/goals/${goalId}`)
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.message).toBe('Goal deleted successfully');
      expect(Goal.delete).toHaveBeenCalledWith(goalId, mockUser.id);
    });

    it('should return 404 for non-existent goal', async () => {
      const goalId = 999;

      Goal.delete = jest.fn().mockResolvedValue(false);

      const response = await request(app)
        .delete(`/api/goals/${goalId}`)
        .set('Cookie', authCookies)
        .expect(404);

      expect(response.body.message).toBe('Goal not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/goals/1')
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });

  describe('GET /api/goals/:id/progress', () => {
    it('should return goal progress', async () => {
      const goalId = 1;
      const mockProgress = {
        goalId: goalId,
        completedChallenges: 3,
        totalChallenges: 5,
        percentComplete: 60,
        hoursSpent: 24,
        estimatedHours: 40,
      };

      Progress.getByGoalId = jest.fn().mockResolvedValue(mockProgress);

      const response = await request(app)
        .get(`/api/goals/${goalId}/progress`)
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.progress).toMatchObject(mockProgress);
      expect(Progress.getByGoalId).toHaveBeenCalledWith(goalId, mockUser.id);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/goals/1/progress')
        .expect(401);

      expect(response.body.message).toContain('authentication required');
    });
  });
});
