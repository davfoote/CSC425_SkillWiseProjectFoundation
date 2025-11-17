// AI integration controller for feedback and hints
const aiService = require('../services/aiService');
const pino = require('pino');

const logger = pino({
  name: 'skillwise-ai-controller',
  level: process.env.LOG_LEVEL || 'info',
});

const aiController = {
  // Generate a new challenge using AI
  generateChallenge: async (req, res, next) => {
    try {
      const { difficulty, category, language, topic } = req.body;
      
      logger.info('Received AI challenge generation request:', {
        userId: req.user?.id,
        preferences: { difficulty, category, language, topic },
      });

      // Validate inputs
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (difficulty && !validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid difficulty level. Must be easy, medium, or hard.',
        });
      }

      // Generate challenge using AI
      const result = await aiService.generateChallenge({
        difficulty,
        category,
        language,
        topic,
      });
      
      logger.info('Successfully generated challenge via controller:', {
        userId: req.user?.id,
        challengeTitle: result.challenge?.title,
      });

      res.status(200).json(result);
    } catch (error) {
      logger.error('Error in generateChallenge controller:', {
        error: error.message,
        userId: req.user?.id,
        stack: error.stack,
      });
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to generate challenge',
      });
    }
  },

  // Generate AI feedback for submission
  generateFeedback: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },

  // Get AI hints for challenge
  getHints: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },

  // Generate challenge suggestions
  suggestChallenges: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },

  // Analyze learning progress
  analyzeProgress: async (req, res, next) => {
    // Implementation needed
    res.status(501).json({ message: 'Not implemented yet' });
  },
};

module.exports = aiController;
