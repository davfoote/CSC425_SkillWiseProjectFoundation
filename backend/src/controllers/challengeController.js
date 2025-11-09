// Challenges CRUD controller
const challengeService = require('../services/challengeService');
const { AppError } = require('../middleware/errorHandler');

const challengeController = {
  // List challenges with optional filters
  getChallenges: async (req, res, next) => {
    try {
      const { difficulty, subject, goalId } = req.query;
      const filters = {};
      if (difficulty) filters.difficulty = difficulty;
      if (subject) filters.subject = subject;
      if (goalId) filters.goalId = Number(goalId);

      const challenges = await challengeService.getChallenges(filters);
      return res.status(200).json({ challenges });
    } catch (error) {
      return next(error);
    }
  },

  getChallengeById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return next(new AppError('Invalid id', 400));

      const challenge = await challengeService.getChallengeById(id);
      if (!challenge) return next(new AppError('Challenge not found', 404));

      return res.status(200).json({ challenge });
    } catch (error) {
      return next(error);
    }
  },

  createChallenge: async (req, res, next) => {
    try {
      const userId = req.user && (req.user.id || req.user.userId);
      const payload = req.body || {};

      if (!payload.title || !payload.description) {
        return next(new AppError('Title and description are required', 400));
      }

      const created = await challengeService.createChallenge(payload, userId);
      return res.status(201).json({ challenge: created });
    } catch (error) {
      return next(error);
    }
  },

  updateChallenge: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return next(new AppError('Invalid id', 400));

      const updated = await challengeService.updateChallenge(id, req.body, req.user && (req.user.id || req.user.userId));
      return res.status(200).json({ challenge: updated });
    } catch (error) {
      return next(error);
    }
  },

  deleteChallenge: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!id) return next(new AppError('Invalid id', 400));

      const deleted = await challengeService.deleteChallenge(id);
      return res.status(200).json({ challenge: deleted });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = challengeController;