const challengeService = require('../services/challengeService');

const challengeController = {
  // Get all challenges with optional filtering
  getChallenges: async (req, res, next) => {
    try {
      const { category, difficulty, isActive, goalId, userId } = req.query;
      
      // Build filters object
      const filters = {};
      if (category) filters.category = category;
      if (difficulty) filters.difficulty = difficulty;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (goalId) filters.goalId = goalId;
      if (userId) filters.userId = userId;

      const challenges = await challengeService.getAllChallenges(filters);

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
      const challenge = await challengeService.getChallengeById(id);

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

  // Create new challenge
  createChallenge: async (req, res, next) => {
    try {
      const challengeData = req.body;
      const userId = req.user.userId; // From auth middleware

      const challenge = await challengeService.createChallenge(challengeData, userId);

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

  // Update challenge
  updateChallenge: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.userId; // From auth middleware

      const challenge = await challengeService.updateChallenge(id, updateData, userId);

      res.status(200).json({
        success: true,
        message: 'Challenge updated successfully',
        data: challenge
      });
    } catch (error) {
      console.error('Error updating challenge:', error);
      
      // Handle specific error cases
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }
      
      if (error.message.includes('permission')) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this challenge'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update challenge',
        error: error.message
      });
    }
  },

  // Delete challenge
  deleteChallenge: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId; // From auth middleware

      const challenge = await challengeService.deleteChallenge(id, userId);

      res.status(200).json({
        success: true,
        message: 'Challenge deleted successfully',
        data: challenge
      });
    } catch (error) {
      console.error('Error deleting challenge:', error);
      
      // Handle specific error cases
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Challenge not found'
        });
      }
      
      if (error.message.includes('permission')) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this challenge'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete challenge',
        error: error.message
      });
    }
  },

  // Get challenges for a specific goal
  getChallengesByGoal: async (req, res, next) => {
    try {
      const { goalId } = req.params;
      const userId = req.user.userId; // From auth middleware

      const challenges = await challengeService.getChallengesByGoal(goalId, userId);

      res.status(200).json({
        success: true,
        count: challenges.length,
        data: challenges
      });
    } catch (error) {
      console.error('Error fetching challenges by goal:', error);
      
      if (error.message.includes('not found') || error.message.includes('permission')) {
        return res.status(404).json({
          success: false,
          message: 'Goal not found or you do not have access to this goal'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch challenges for goal',
        error: error.message
      });
    }
  }
};

module.exports = challengeController;