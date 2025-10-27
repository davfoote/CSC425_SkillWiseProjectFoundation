const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const auth = require('../middleware/auth');

// Small helper to coerce & bound numeric query params
const clampInt = (value, { def = 10, min = 1, max = 100 } = {}) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return def;
  return Math.min(Math.max(n, min), max);
};

// GET /api/leaderboard?timeframe=weekly&limit=20
router.get('/', auth, (req, res, next) => {
  // Normalize query for controller
  req.query.timeframe = (req.query.timeframe || 'all').toLowerCase();
  req.query.limit = clampInt(req.query.limit, { def: 10, min: 1, max: 100 });
  return leaderboardController.getLeaderboard(req, res, next);
});

// GET /api/leaderboard/ranking
router.get('/ranking', auth, leaderboardController.getUserRanking);

// GET /api/leaderboard/points
router.get('/points', auth, leaderboardController.getPointsBreakdown);

// GET /api/leaderboard/achievements?limit=20
router.get('/achievements', auth, (req, res, next) => {
  req.query.limit = clampInt(req.query.limit, { def: 20, min: 1, max: 100 });
  return leaderboardController.getAchievements(req, res, next);
});

module.exports = router;
