// src/models/Leaderboard.js
const db = require('../database/connection');

class Leaderboard {
  // Global leaderboard from user_statistics (fast + matches schema)
  static async getGlobalLeaderboard (limit = 10) {
    try {
      const sql = `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          us.total_points,
          us.total_challenges_completed,
          us.average_score,
          u.created_at AS join_date
        FROM users u
        LEFT JOIN user_statistics us ON us.user_id = u.id
        WHERE u.is_active = true
        ORDER BY us.total_points DESC NULLS LAST,
                 us.total_challenges_completed DESC NULLS LAST,
                 us.average_score DESC NULLS LAST,
                 u.created_at ASC
        LIMIT $1
      `;
      const result = await db.query(sql, [limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting global leaderboard: ${error.message}`);
    }
  }

  // Weekly leaderboard from progress_events within current week
  static async getWeeklyLeaderboard (limit = 10) {
    try {
      const sql = `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          COALESCE(SUM(pe.points_earned), 0) AS weekly_points,
          COUNT(CASE WHEN pe.event_type = 'challenge_completed' THEN 1 END) AS weekly_completions
        FROM users u
        LEFT JOIN progress_events pe
          ON pe.user_id = u.id
         AND pe.timestamp_occurred >= DATE_TRUNC('week', CURRENT_DATE)
        WHERE u.is_active = true
        GROUP BY u.id, u.first_name, u.last_name
        ORDER BY weekly_points DESC, weekly_completions DESC, u.first_name ASC
        LIMIT $1
      `;
      const result = await db.query(sql, [limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting weekly leaderboard: ${error.message}`);
    }
  }

  // Monthly leaderboard from progress_events within current month
  static async getMonthlyLeaderboard (limit = 10) {
    try {
      const sql = `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          COALESCE(SUM(pe.points_earned), 0) AS monthly_points,
          COUNT(CASE WHEN pe.event_type = 'challenge_completed' THEN 1 END) AS monthly_completions
        FROM users u
        LEFT JOIN progress_events pe
          ON pe.user_id = u.id
         AND pe.timestamp_occurred >= DATE_TRUNC('month', CURRENT_DATE)
        WHERE u.is_active = true
        GROUP BY u.id, u.first_name, u.last_name
        ORDER BY monthly_points DESC, monthly_completions DESC, u.first_name ASC
        LIMIT $1
      `;
      const result = await db.query(sql, [limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting monthly leaderboard: ${error.message}`);
    }
  }

  // Rank by total_points using user_statistics
  static async getUserRank (userId) {
    try {
      const sql = `
        WITH ranked AS (
          SELECT
            u.id,
            COALESCE(us.total_points, 0) AS pts,
            RANK() OVER (ORDER BY COALESCE(us.total_points, 0) DESC) AS rank
          FROM users u
          LEFT JOIN user_statistics us ON us.user_id = u.id
          WHERE u.is_active = true
        )
        SELECT rank, pts AS total_points
        FROM ranked
        WHERE id = $1
      `;
      const result = await db.query(sql, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error getting user rank: ${error.message}`);
    }
  }

  // Subject leaderboard: aggregate by submissions joined to challenges
  // Uses challenge points_reward as points, counts graded submissions as completions
  static async getSubjectLeaderboard (subject, limit = 10) {
    try {
      const sql = `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          COALESCE(SUM(c.points_reward), 0) AS subject_points,
          COUNT(CASE WHEN s.score IS NOT NULL THEN 1 END) AS subject_completions
        FROM users u
        LEFT JOIN submissions s ON s.user_id = u.id
        LEFT JOIN challenges c ON c.id = s.challenge_id
        WHERE u.is_active = true
          AND c.subject = $1
        GROUP BY u.id, u.first_name, u.last_name
        ORDER BY subject_points DESC, subject_completions DESC, u.first_name ASC
        LIMIT $2
      `;
      const result = await db.query(sql, [subject, limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting subject leaderboard: ${error.message}`);
    }
  }
}

module.exports = Leaderboard;
