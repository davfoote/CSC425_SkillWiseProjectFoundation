// AI integration controller
const aiService = require('../services/aiService');
const { AppError } = require('../middleware/errorHandler');

const aiController = {
  // POST /api/ai/feedback
  generateFeedback: async (req, res, next) => {
    try {
      const { submissionText, challengeContext } = req.body || {};
      if (!submissionText) {
        return next(new AppError('submissionText is required', 400, 'VALIDATION_ERROR'));
      }
      const feedback = await aiService.generateFeedback(submissionText, challengeContext || {});
      res.status(200).json({ feedback });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/ai/hints/:challengeId
  getHints: async (req, res, next) => {
    try {
      const { challengeId } = req.params;
      if (!challengeId) {
        return next(new AppError('challengeId is required', 400, 'VALIDATION_ERROR'));
      }
      // optional: pass lightweight progress context from query
      const userProgress = {
        attempts: req.query.attempts ? Number(req.query.attempts) : undefined,
        lastScore: req.query.lastScore ? Number(req.query.lastScore) : undefined,
      };
      const hints = await aiService.generateHints(challengeId, userProgress);
      res.status(200).json({ challengeId, hints });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/ai/suggestions
  suggestChallenges: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));
      }
      const suggestions = await aiService.suggestNextChallenges(userId);
      res.status(200).json({ suggestions });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/ai/analysis
  analyzeProgress: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));
      }
      const timeframe = req.query.timeframe || '30d';
      const learningData = {
        timeframe,
        includeTrends: req.query.includeTrends === 'true',
        includeRecommendations: req.query.includeRecommendations === 'true',
      };
      const analysis = await aiService.analyzePattern(userId, learningData);
      res.status(200).json({ userId, timeframe, analysis });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = aiController;
