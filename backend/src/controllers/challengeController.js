const challengeService = require('../services/challengeService');
const goalService = require('../services/goalService');

const challengeController = {
  getChallenges: async (req, res, next) => {
    try {
      const filters = { difficulty_level: req.query.difficulty_level, category: req.query.category };
      const challenges = await challengeService.getChallenges(filters);
      return res.status(200).json({ data: challenges });
    } catch (error) {
      next(error);
    }
  },

  getChallengeById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const challenges = await challengeService.getChallenges();
      const challenge = challenges.find(c => String(c.id) === String(id));
      if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
      return res.status(200).json({ data: challenge });
    } catch (error) {
      next(error);
    }
  },

  createChallenge: async (req, res, next) => {
    try {
      const payload = req.body;
      const prisma = require('../database/prisma');
      const created = await prisma.challenge.create({ data: {
        title: payload.title,
        description: payload.description || null,
        instructions: payload.instructions || null,
        category: payload.category || null,
        difficultyLevel: payload.difficulty_level || 'medium',
        pointsReward: payload.points_reward || 0,
        createdBy: payload.created_by || null,
        tags: payload.tags || null,
        isActive: payload.is_active !== undefined ? payload.is_active : true,
        goalId: payload.goal_id || null,
        isCompleted: payload.is_completed !== undefined ? payload.is_completed : false
      }});
      return res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  },

  updateChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload = req.body;
      const prisma = require('../database/prisma');
      // read previous to detect isCompleted transition
      const prev = await prisma.challenge.findUnique({ where: { id: Number(id) } });
      const data = {
        title: payload.title !== undefined ? payload.title : prev.title,
        description: payload.description !== undefined ? payload.description : prev.description,
        instructions: payload.instructions !== undefined ? payload.instructions : prev.instructions,
        difficultyLevel: payload.difficulty_level !== undefined ? payload.difficulty_level : prev.difficultyLevel,
        category: payload.category !== undefined ? payload.category : prev.category,
        pointsReward: payload.points_reward !== undefined ? payload.points_reward : prev.pointsReward,
        isActive: payload.is_active !== undefined ? payload.is_active : prev.isActive,
        isCompleted: payload.is_completed !== undefined ? payload.is_completed : prev.isCompleted,
        goalId: payload.goal_id !== undefined ? payload.goal_id : prev.goalId
      };

      const updated = await prisma.challenge.update({ where: { id: Number(id) }, data });

      // If this challenge was marked completed now, and is linked to a goal, recompute goal progress
      if (!prev.isCompleted && updated.isCompleted && updated.goalId) {
        try {
          // count total challenges for the goal and completed ones
          const total = await prisma.challenge.count({ where: { goalId: updated.goalId } });
          const completed = await prisma.challenge.count({ where: { goalId: updated.goalId, isCompleted: true } });
          const percent = total > 0 ? Math.round((completed / total) * 100) : (completed ? 100 : 0);
          await goalService.updateProgress(updated.goalId, percent);
        } catch (e) {
          console.error('Failed to update goal progress after challenge completion', e);
        }
      }

      return res.status(200).json({ data: updated });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Challenge not found' });
      next(error);
    }
  },

  deleteChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      const prisma = require('../database/prisma');
      const deleted = await prisma.challenge.delete({ where: { id: Number(id) } });
      return res.status(200).json({ data: deleted });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Challenge not found' });
      next(error);
    }
  }
};

module.exports = challengeController;