// tests/unit/controllers/goalController.test.js

jest.mock('../../../src/services/goalService', () => ({
  getGoals: jest.fn(),
  getGoalById: jest.fn(),
  createGoal: jest.fn(),
  updateGoal: jest.fn(),
  deleteGoal: jest.fn(),
}));

const goalService = require('../../../src/services/goalService');
const goalController = require('../../../src/controllers/goalController');

// Mock Express response helpers
const createRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('GoalController - unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGoals', () => {
    it('returns all goals for the user', async () => {
      const req = { user: { id: 1 } };
      const res = createRes();
      const next = jest.fn();

      const mockGoals = [
        { id: 1, title: 'Learn JavaScript', progress: 50 },
        { id: 2, title: 'Study SQL', progress: 20 },
      ];

      goalService.getGoals.mockResolvedValue(mockGoals);

      await goalController.getGoals(req, res, next);

      expect(goalService.getGoals).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ goals: mockGoals });
      expect(next).not.toHaveBeenCalled();
    });

    it('handles errors properly', async () => {
      const req = { user: { id: 1 } };
      const res = createRes();
      const next = jest.fn();

      const err = new Error('Database error');
      goalService.getGoals.mockRejectedValue(err);

      await goalController.getGoals(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getGoalById', () => {
    it('returns a specific goal by ID', async () => {
      const req = { params: { id: '2' }, user: { id: 1 } };
      const res = createRes();
      const next = jest.fn();

      goalService.getGoalById.mockResolvedValue({
        id: 2,
        title: 'Learn Python',
        progress: 80,
      });

      await goalController.getGoalById(req, res, next);

      expect(goalService.getGoalById).toHaveBeenCalledWith('2', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        goal: { id: 2, title: 'Learn Python', progress: 80 },
      });
    });

    it('returns 404 if goal not found', async () => {
      const req = { params: { id: '99' }, user: { id: 1 } };
      const res = createRes();
      const next = jest.fn();

      goalService.getGoalById.mockResolvedValue(null);

      await goalController.getGoalById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Goal not found' });
    });
  });

  describe('createGoal', () => {
    it('creates a new goal successfully', async () => {
      const req = {
        user: { id: 1 },
        body: {
          title: 'Master React',
          description: 'Finish React course',
          difficulty: 'medium',
        },
      };
      const res = createRes();
      const next = jest.fn();

      goalService.createGoal.mockResolvedValue({
        id: 10,
        ...req.body,
        userId: 1,
      });

      await goalController.createGoal(req, res, next);

      expect(goalService.createGoal).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        goal: expect.objectContaining({ title: 'Master React' }),
      });
    });

    it('returns 400 for invalid data', async () => {
      const req = { user: { id: 1 }, body: { description: 'Missing title' } };
      const res = createRes();
      const next = jest.fn();

      await goalController.createGoal(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid goal data' });
      expect(goalService.createGoal).not.toHaveBeenCalled();
    });

    it('handles service errors properly', async () => {
      const req = {
        user: { id: 1 },
        body: { title: 'Goal X', description: 'Sample' },
      };
      const res = createRes();
      const next = jest.fn();

      const err = new Error('Insert failed');
      goalService.createGoal.mockRejectedValue(err);

      await goalController.createGoal(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('updateGoal', () => {
    it('updates an existing goal', async () => {
      const req = {
        user: { id: 1 },
        params: { id: '5' },
        body: { title: 'Updated Goal', progress: 90 },
      };
      const res = createRes();
      const next = jest.fn();

      goalService.updateGoal.mockResolvedValue({
        id: 5,
        title: 'Updated Goal',
        progress: 90,
      });

      await goalController.updateGoal(req, res, next);

      expect(goalService.updateGoal).toHaveBeenCalledWith('5', 1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        goal: expect.objectContaining({ id: 5, progress: 90 }),
      });
    });

    it('returns 404 if goal not found', async () => {
      const req = {
        user: { id: 1 },
        params: { id: '999' },
        body: { title: 'Not Found' },
      };
      const res = createRes();
      const next = jest.fn();

      goalService.updateGoal.mockResolvedValue(null);

      await goalController.updateGoal(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Goal not found' });
    });
  });

  describe('deleteGoal', () => {
    it('deletes a goal successfully', async () => {
      const req = { user: { id: 1 }, params: { id: '3' } };
      const res = createRes();
      const next = jest.fn();

      goalService.deleteGoal.mockResolvedValue(true);

      await goalController.deleteGoal(req, res, next);

      expect(goalService.deleteGoal).toHaveBeenCalledWith('3', 1);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('returns 404 when goal not found', async () => {
      const req = { user: { id: 1 }, params: { id: '100' } };
      const res = createRes();
      const next = jest.fn();

      goalService.deleteGoal.mockResolvedValue(false);

      await goalController.deleteGoal(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Goal not found' });
    });
  });
});
