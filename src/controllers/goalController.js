const goalService = require('../services/goalService');
const Goal = require('../models/Goal');

const goalController = {
  // Get all goals for the authenticated user
  getGoals: async (req, res, next) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      const goals = await goalService.getUserGoals(userId);
      return res.status(200).json({ data: goals });
    } catch (error) {
      next(error);
    }
  },

  // Get single goal by id
  getGoalById: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const goal = await Goal.findById(goalId);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      return res.status(200).json({ data: goal });
    } catch (error) {
      next(error);
    }
  },

  // Create new goal
  createGoal: async (req, res, next) => {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      const payload = req.body;
      const created = await goalService.createGoal(payload, userId);
      return res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  },

  // Update existing goal
  updateGoal: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const updateData = req.body;
      const updated = await Goal.update(goalId, updateData);
      if (!updated) return res.status(404).json({ message: 'Goal not found' });
      return res.status(200).json({ data: updated });
    } catch (error) {
      next(error);
    }
  },

  // Delete goal
  deleteGoal: async (req, res, next) => {
    try {
      const goalId = req.params.id;
      const deleted = await Goal.delete(goalId);
      if (!deleted) return res.status(404).json({ message: 'Goal not found' });
      return res.status(200).json({ data: deleted });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = goalController;