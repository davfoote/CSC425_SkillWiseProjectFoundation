// Goals controller
const goalService = require('../services/goalService');
const { AppError } = require('../middleware/errorHandler');

const goalController = {
  // GET /api/goals
  getGoals: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const goals = await goalService.getGoals(userId);
      return res.status(200).json({ goals });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/goals/:id
  getGoalById: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      // Expect service to enforce ownership/visibility
      const goal = await goalService.getGoalById(id, userId);
      if (!goal) return res.status(404).json({ error: 'Goal not found' });

      return res.status(200).json({ goal });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/goals
  createGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const {
        title,
        description,
        category,
        difficulty = 'medium',
        targetCompletionDate, // ISO string
        pointsReward,
        isPublic,
      } = req.body || {};

      if (!title) {
        return res.status(400).json({ error: 'Invalid goal data' });
      }

      const created = await goalService.createGoal(userId, req.body);
      return res.status(201).json({ goal: created });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/goals/:id
  updateGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const {
        title,
        description,
        category,
        difficulty,
        targetCompletionDate,
        isCompleted,
        completionDate,
        progressPercentage,
        pointsReward,
        isPublic,
        status,
      } = req.body || {};

      // For unit tests we expect updateGoal to be called with (id, userId, body)
      const updated = await goalService.updateGoal(id, userId, req.body);
      if (!updated) return res.status(404).json({ error: 'Goal not found' });

      return res.status(200).json({ goal: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/goals/:id
  deleteGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const deleted = await goalService.deleteGoal(id, userId);
      if (!deleted) return res.status(404).json({ error: 'Goal not found' });

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = goalController;
