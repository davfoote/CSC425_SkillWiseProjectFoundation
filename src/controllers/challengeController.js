const challengeService = require('../services/challengeService');
const Challenge = require('../models/Challenge');

const challengeController = {
  // Get list of challenges (supports simple query filters)
  getChallenges: async (req, res, next) => {
    try {
      const filters = {
        difficulty_level: req.query.difficulty_level,
        category: req.query.category
      };
      const challenges = await challengeService.getChallenges(filters);
      return res.status(200).json({ data: challenges });
    } catch (error) {
      next(error);
    }
  },

  // Get single challenge
  getChallengeById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const challenge = await Challenge.findById(id);
      if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
      return res.status(200).json({ data: challenge });
    } catch (error) {
      next(error);
    }
  },

  // Create challenge (restricted via middleware in routes if needed)
  createChallenge: async (req, res, next) => {
    try {
      const payload = req.body;
      const created = await Challenge.create(payload);
      return res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  },

  // Update
  updateChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updated = await Challenge.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Challenge not found' });
      return res.status(200).json({ data: updated });
    } catch (error) {
      next(error);
    }
  },

  // Delete
  deleteChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      const deleted = await Challenge.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Challenge not found' });
      return res.status(200).json({ data: deleted });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = challengeController;