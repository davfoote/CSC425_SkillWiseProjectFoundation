// tests/integration/goals.test.js

const request = require('supertest');

// Mock auth middleware to inject a fake logged-in user
jest.mock('../../src/middleware/auth', () => (req, _res, next) => {
  req.user = { id: 123, role: 'student' };
  next();
});

// Mock goal service used by the controller
const mockGoalService = {
  getGoals: jest.fn(),
  getGoalById: jest.fn(),
  createGoal: jest.fn(),
  updateGoal: jest.fn(),
  deleteGoal: jest.fn(),
};
jest.mock('../../src/services/goalService', () => mockGoalService);

const app = require('../../src/app');

describe('Goals API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/goals', () => {
    it('returns all goals for the authenticated user', async () => {
      mockGoalService.getGoals.mockResolvedValue([
        { id: 1, title: 'Learn JavaScript', progress: 40 },
        { id: 2, title: 'Master SQL', progress: 75 },
      ]);

      const res = await request(app).get('/api/goals');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        goals: expect.arrayContaining([
          expect.objectContaining({ title: 'Learn JavaScript' }),
        ]),
      });
      expect(mockGoalService.getGoals).toHaveBeenCalledWith(123);
    });
  });

  describe('GET /api/goals/:id', () => {
    it('returns a single goal by ID', async () => {
      mockGoalService.getGoalById.mockResolvedValue({
        id: 5,
        title: 'Finish Node.js Course',
        progress: 90,
      });

      const res = await request(app).get('/api/goals/5');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        goal: expect.objectContaining({ id: 5, title: 'Finish Node.js Course' }),
      });
      expect(mockGoalService.getGoalById).toHaveBeenCalledWith('5', 123);
    });

    it('404 when goal not found', async () => {
      mockGoalService.getGoalById.mockResolvedValue(null);

      const res = await request(app).get('/api/goals/999');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/goals', () => {
    const newGoal = {
      title: 'Complete React Course',
      description: 'Finish all modules on React fundamentals',
      category: 'Web Development',
      difficulty: 'medium',
      targetCompletionDate: '2025-12-31',
    };

    it('creates a new goal successfully', async () => {
      mockGoalService.createGoal.mockResolvedValue({ id: 10, ...newGoal });

      const res = await request(app).post('/api/goals').send(newGoal);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        goal: expect.objectContaining({ title: 'Complete React Course' }),
      });
      expect(mockGoalService.createGoal).toHaveBeenCalledWith(123, newGoal);
    });

    it('400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/goals')
        .send({ description: 'Missing title' });

      expect(res.status).toBe(400);
      expect(mockGoalService.createGoal).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/goals/:id', () => {
    it('updates an existing goal', async () => {
      mockGoalService.updateGoal.mockResolvedValue({
        id: 1,
        title: 'Updated Title',
        progress: 80,
      });

      const res = await request(app)
        .put('/api/goals/1')
        .send({ title: 'Updated Title', progress: 80 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        goal: expect.objectContaining({ id: 1, title: 'Updated Title' }),
      });
      expect(mockGoalService.updateGoal).toHaveBeenCalledWith('1', 123, {
        title: 'Updated Title',
        progress: 80,
      });
    });

    it('404 if goal not found', async () => {
      mockGoalService.updateGoal.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/goals/404')
        .send({ title: 'Nonexistent' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/goals/:id', () => {
    it('deletes an existing goal', async () => {
      mockGoalService.deleteGoal.mockResolvedValue({ id: 7 });

      const res = await request(app).delete('/api/goals/7');

      expect(res.status).toBe(204);
      expect(mockGoalService.deleteGoal).toHaveBeenCalledWith('7', 123);
    });

    it('404 when trying to delete nonexistent goal', async () => {
      mockGoalService.deleteGoal.mockResolvedValue(null);

      const res = await request(app).delete('/api/goals/999');

      expect(res.status).toBe(404);
    });
  });
});
