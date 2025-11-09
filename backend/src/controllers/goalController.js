// Goals CRUD controller
const goalService = require('../services/goalService');
const { AppError } = require('../middleware/errorHandler');

const goalController = {
  // Get all goals for authenticated user
  getGoals: async (req, res, next) => {
    try {
  const userId = req.user && (req.user.id || req.user.userId || req.userId);
      if (!userId) return next(new AppError('Unauthorized', 401));

      const goals = await goalService.getUserGoals(userId);
      return res.status(200).json({ goals });
    } catch (error) {
      return next(error);
    }
  },

  // Get single goal by id (must belong to user)
  getGoalById: async (req, res, next) => {
    try {
  const userId = req.user && (req.user.id || req.user.userId || req.userId);
      const goalId = parseInt(req.params.id, 10);
      if (!userId) return next(new AppError('Unauthorized', 401));
      if (!goalId) return next(new AppError('Invalid goal id', 400));

      const goals = await goalService.getUserGoals(userId);
      const goal = goals.find((g) => Number(g.id) === goalId);
      if (!goal) return next(new AppError('Goal not found', 404));

      return res.status(200).json({ goal });
    } catch (error) {
      return next(error);
    }
  },

  // Create a new goal
  createGoal: async (req, res, next) => {
    try {
  const userId = req.user && (req.user.id || req.user.userId || req.userId);
      if (!userId) return next(new AppError('Unauthorized', 401));

      const created = await goalService.createGoal(req.body, userId);
      return res.status(201).json({ goal: created });
    } catch (error) {
      return next(error);
    }
  },

  // Update an existing goal
  updateGoal: async (req, res, next) => {
    try {
  const userId = req.user && (req.user.id || req.user.userId || req.userId);
      const goalId = parseInt(req.params.id, 10);
      if (!userId) return next(new AppError('Unauthorized', 401));
      if (!goalId) return next(new AppError('Invalid goal id', 400));

      const updated = await goalService.updateGoal(goalId, req.body, userId);
      return res.status(200).json({ goal: updated });
    } catch (error) {
      return next(error);
    }
  },

  // Delete a goal
  deleteGoal: async (req, res, next) => {
    try {
  const userId = req.user && (req.user.id || req.user.userId || req.userId);
      const goalId = parseInt(req.params.id, 10);
      if (!userId) return next(new AppError('Unauthorized', 401));
      if (!goalId) return next(new AppError('Invalid goal id', 400));

      const deleted = await goalService.deleteGoal(goalId, userId);
      return res.status(200).json({ goal: deleted });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = goalController;