// Progress controller
const progressService = require('../services/progressService');
const { AppError } = require('../middleware/errorHandler');

const requireUser = (req) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401, 'NO_TOKEN');
  return userId;
};

const progressController = {
  // GET /api/progress
  getProgress: async (req, res, next) => {
    try {
      const userId = requireUser(req);
      if (!progressService.calculateOverallProgress) {
        return next(new AppError('Progress service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const overview = await progressService.calculateOverallProgress(userId);
      res.status(200).json({ userId, overview });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/progress/event
  updateProgress: async (req, res, next) => {
    try {
      const userId = requireUser(req);
      const { eventType, eventData = {}, pointsEarned, relatedGoalId, relatedChallengeId, relatedSubmissionId, sessionId, occurredAt } = req.body || {};
      if (!eventType) return next(new AppError('eventType is required', 400, 'VALIDATION_ERROR'));
      if (!progressService.trackEvent) {
        return next(new AppError('Track event service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const payload = {
        userId,
        eventType,
        eventData,
        pointsEarned: typeof pointsEarned === 'number' ? pointsEarned : undefined,
        relatedGoalId,
        relatedChallengeId,
        relatedSubmissionId,
        sessionId,
        occurredAt,
      };
      const saved = await progressService.trackEvent(userId, eventType, payload);
      res.status(201).json({ event: saved });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/progress/analytics?timeframe=30d
  getAnalytics: async (req, res, next) => {
    try {
      const userId = requireUser(req);
      const timeframe = req.query.timeframe || '30d';
      if (!progressService.generateAnalytics) {
        return next(new AppError('Analytics service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const analytics = await progressService.generateAnalytics(userId, timeframe);
      res.status(200).json({ userId, timeframe, analytics });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/progress/milestones
  getMilestones: async (req, res, next) => {
    try {
      const userId = requireUser(req);
      if (!progressService.checkMilestones) {
        return next(new AppError('Milestones service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const milestones = await progressService.checkMilestones(userId);
      res.status(200).json({ userId, milestones });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = progressController;
