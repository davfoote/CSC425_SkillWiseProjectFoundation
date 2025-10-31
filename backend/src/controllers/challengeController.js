const Challenge = require('../models/Challenge');

const challengeController = {
  // Get all challenges with optional filtering
  getChallenges: async (req, res, next) => {
    try {
      const { category, difficulty, isActive } = req.query;
      let challenges;

      // Apply filters if provided
      if (category) {
        challenges = await Challenge.findBySubject(category);
      } else if (difficulty) {
        challenges = await Challenge.findByDifficulty(difficulty);
      } else {
        challenges = await Challenge.findAll();
      }

      // Filter by active status if specified
      if (isActive !== undefined) {
        const activeFilter = isActive === 'true';
        challenges = challenges.filter(challenge => challenge.is_active === activeFilter);
      }

      res.status(200).json({
        success: true,
        count: challenges.length,
        data: challenges
      });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch challenges',
        error: error.message
      });
    }
  },

  // Get challenge by ID
  getChallengeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findById(id);

      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }

      res.status(200).json({
        success: true,
        data: challenge
      });
    } catch (error) {
      console.error('Error fetching challenge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch challenge',
        error: error.message
      });
    }
  },

  // Create new challenge (admin only - basic implementation)
  createChallenge: async (req, res, next) => {
    try {
      const challengeData = {
        ...req.body,
        created_by: req.user.userId // From auth middleware
      };

      const challenge = await Challenge.create(challengeData);

      res.status(201).json({
        success: true,
        message: 'Challenge created successfully',
        data: challenge
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create challenge',
        error: error.message
      });
    }
  },

  // Update challenge (admin only - basic implementation)
  updateChallenge: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const challenge = await Challenge.update(id, updateData);

      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Challenge updated successfully',
        data: challenge
      });
    } catch (error) {
      console.error('Error updating challenge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update challenge',
        error: error.message
      });
    }
  },

  // Delete challenge (admin only - basic implementation)
  deleteChallenge: async (req, res, next) => {
    try {
      const { id } = req.params;
      const challenge = await Challenge.delete(id);

      if (!challenge) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Challenge deleted successfully',
        data: challenge
      });
    } catch (error) {
      console.error('Error deleting challenge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete challenge',
        error: error.message
      });
    }
  }
};

module.exports = challengeController;