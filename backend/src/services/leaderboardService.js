// src/services/leaderboardService.js
const Leaderboard = require('../models/Leaderboard');
const { AppError } = require('../middleware/errorHandler');
const db = require('../database/connection');

const leaderboardService = {
  /**
   * Calculate rankings based on a timeframe:
   * "all", "weekly", or "monthly"
   */
  async calculateRankings (timeframe = 'all') {
    try {
      let rankings;

      switch (timeframe) {
      case 'weekly':
        rankings = await Leaderboard.getWeeklyLeaderboard(50);
        break;
      case 'monthly':
        rankings = await Leaderboard.getMonthlyLeaderboard(50);
        break;
      default:
        rankings = await Leaderboard.getGlobalLeaderboard(50);
      }

      return rankings.map((r, i) => ({
        rank: i + 1,
        userId: r.id,
        username: r.username,
        firstName: r.first_name,
        lastName: r.last_name,
        totalPoints:
          r.total_points || r.weekly_points || r.monthly_points || 0,
        challengesCompleted:
          r.challenges_completed ||
          r.weekly_completions ||
          r.monthly_completions ||
          0,
        averageScore: Number(r.average_score) || null,
      }));
    } catch (error) {
      console.error('Error calculating rankings:', error.message);
      throw new AppError('Failed to calculate rankings', 500, 'LEADERBOARD_CALC_ERROR');
    }
  },

  /**
   * Increment or adjust a user's points
   * Optionally specify a reason for logging
   */
  async updateUserPoints (userId, points, reason = 'manual adjustment') {
    try {
      if (!userId || typeof points !== 'number') {
        throw new AppError('Invalid parameters for point update', 400, 'INVALID_PARAMS');
      }

      const query = `
        INSERT INTO leaderboard (user_id, total_points, last_updated, last_reason)
        VALUES ($1, $2, NOW(), $3)
        ON CONFLICT (user_id)
        DO UPDATE SET 
          total_points = leaderboard.total_points + EXCLUDED.total_points,
          last_updated = NOW(),
          last_reason = EXCLUDED.last_reason
        RETURNING *;
      `;

      const result = await db.query(query, [userId, points, reason]);
      return {
        ...result.rows[0],
        message: `User ${userId} points updated by ${points} (${reason})`,
      };
    } catch (error) {
      console.error('Error updating user points:', error.message);
      throw new AppError('Failed to update user points', 500, 'POINT_UPDATE_ERROR');
    }
  },

  /**
   * Get top N performers globally
   */
  async getTopPerformers (limit = 10) {
    try {
      const topUsers = await Leaderboard.getGlobalLeaderboard(limit);
      return topUsers.map((u, i) => ({
        rank: i + 1,
        userId: u.id,
        username: u.username,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
        points: Number(u.total_points) || 0,
        challengesCompleted: Number(u.challenges_completed) || 0,
        averageScore: Number(u.average_score) || 0,
      }));
    } catch (error) {
      console.error('Error fetching top performers:', error.message);
      throw new AppError('Failed to retrieve top performers', 500, 'TOP_PERFORMERS_ERROR');
    }
  },

  /**
   * Calculate points for a specific achievement
   * Allows dynamic weighting for difficulty
   */
  calculateAchievementPoints (achievement) {
    if (!achievement || !achievement.difficulty) return 0;

    const basePoints = achievement.points_reward || 10;
    const difficultyMultiplier = {
      easy: 1.0,
      medium: 1.5,
      hard: 2.0,
    }[achievement.difficulty] || 1.0;

    const bonus =
      achievement.special === true ? 1.25 : 1.0; // extra for rare badges

    return Math.round(basePoints * difficultyMultiplier * bonus);
  },
};

module.exports = leaderboardService;
