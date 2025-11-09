const goalService = require('../services/goalService');

const goalController = {
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

  getGoalById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const goals = await goalService.getUserGoals(req.user.id);
      const goal = goals.find(g => String(g.id) === String(id));
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      return res.status(200).json({ data: goal });
    } catch (error) {
      next(error);
    }
  },

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

  updateGoal: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const updated = await goalService.updateGoal(id, updateData);
      if (!updated) return res.status(404).json({ message: 'Goal not found' });
      return res.status(200).json({ data: updated });
    } catch (error) {
      next(error);
    }
  },

  deleteGoal: async (req, res, next) => {
    try {
      const id = req.params.id;
      // Use prisma directly for delete to simplify
      const prisma = require('../database/prisma');
      const deleted = await prisma.goal.delete({ where: { id: Number(id) } });
      return res.status(200).json({ data: deleted });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Goal not found' });
      }
      next(error);
    }
  }
};

module.exports = goalController;