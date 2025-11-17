// AI integration controller for feedback and hints
const aiService = require('../services/aiService');

const aiController = {
  // Generate a new challenge using AI
  generateChallenge: async (req, res, next) => {
    try {
      const { difficulty, category, language, topic } = req.body;

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

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateChallenge controller:', error);
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
