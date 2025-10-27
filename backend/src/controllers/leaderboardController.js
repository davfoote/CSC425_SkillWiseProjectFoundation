// Leaderboard controller
const leaderboardService = require('../services/leaderboardService');
const { AppError } = require('../middleware/errorHandler');

const normalizeTimeframe = (tf) => {
  const v = (tf || '').toLowerCase();
  if (['daily', 'weekly', 'monthly', 'all', 'all-time'].includes(v)) return v === 'all-time' ? 'all' : v;
  return 'all';
};

const leaderboardController = {
  // GET /api/leaderboard?timeframe=weekly&limit=10
  getLeaderboard: async (req, res, next) => {
    try {
      const timeframe = normalizeTimeframe(req.query.timeframe);
      const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;

      let results;
      if (leaderboardService.calculateRankings) {
        results = await leaderboardService.calculateRankings(timeframe);
      } else if (leaderboardService.getTopPerformers) {
        results = await leaderboardService.getTopPerformers(limit);
      } else {
        return next(new AppError('Leaderboard service not available', 501, 'NOT_IMPLEMENTED'));
      }

      if (Array.isArray(results) && results.length > limit) {
        results = results.slice(0, limit);
      }

      res.status(200).json({
        timeframe,
        items: results || [],
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/leaderboard/ranking?timeframe=monthly
  getUserRanking: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const timeframe = normalizeTimeframe(req.query.timeframe);

      // Prefer a direct service method if implemented
      if (leaderboardService.getUserRank) {
        const rankInfo = await leaderboardService.getUserRank(userId, timeframe);
        return res.status(200).json({
          userId,
          timeframe,
          rank: rankInfo?.rank ?? null,
          totalPoints: rankInfo?.totalPoints ?? 0,
        });
      }

      // Fallback: compute from full rankings
      if (!leaderboardService.calculateRankings) {
        return next(new AppError('Ranking service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const rankings = await leaderboardService.calculateRankings(timeframe);

      const idx = (rankings || []).findIndex(
        (r) => r.id === userId || r.user_id === userId,
      );

      const entry = idx >= 0 ? rankings[idx] : null;

      res.status(200).json({
        userId,
        timeframe,
        rank: idx >= 0 ? idx + 1 : null,
        totalPoints:
          entry?.total_points ??
          entry?.points ??
          0,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/leaderboard/points
  getPointsBreakdown: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      if (!leaderboardService.getPointsBreakdown) {
        return next(new AppError('Points breakdown not available', 501, 'NOT_IMPLEMENTED'));
      }

      const breakdown = await leaderboardService.getPointsBreakdown(userId);
      res.status(200).json({ userId, breakdown });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/leaderboard/achievements
  getAchievements: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      if (!leaderboardService.getAchievements) {
        return next(new AppError('Achievements not available', 501, 'NOT_IMPLEMENTED'));
      }

      const achievements = await leaderboardService.getAchievements(userId);
      res.status(200).json({ userId, achievements });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = leaderboardController;
