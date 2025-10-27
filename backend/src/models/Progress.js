// src/models/Progress.js
const db = require('../database/connection');

class Progress {
  /** Get all progress events for a specific user */
  static async findByUserId (userId) {
    try {
      const sql = `
        SELECT
          id, user_id, challenge_id, event_type,
          points_earned, timestamp_occurred, metadata,
          created_at, updated_at
        FROM progress_events
        WHERE user_id = $1
        ORDER BY timestamp_occurred DESC
      `;
      const result = await db.query(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding progress for user: ${error.message}`);
    }
  }

  /** Find events for a given user + challenge combo */
  static async findByUserAndChallenge (userId, challengeId) {
    try {
      const sql = `
        SELECT
          id, user_id, challenge_id, event_type,
          points_earned, timestamp_occurred, metadata,
          created_at, updated_at
        FROM progress_events
        WHERE user_id = $1 AND challenge_id = $2
        ORDER BY timestamp_occurred DESC
      `;
      const result = await db.query(sql, [userId, challengeId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding progress for challenge: ${error.message}`);
    }
  }

  /** Aggregate statistics for a user (from user_statistics) */
  static async getUserStats (userId) {
    try {
      const sql = `
        SELECT
          total_points,
          total_challenges_completed,
          average_score,
          learning_streak_days,
          total_learning_time_minutes,
          updated_at AS last_updated
        FROM user_statistics
        WHERE user_id = $1
      `;
      const result = await db.query(sql, [userId]);
      return result.rows[0] || {
        total_points: 0,
        total_challenges_completed: 0,
        average_score: 0,
        learning_streak_days: 0,
        total_learning_time_minutes: 0,
      };
    } catch (error) {
      throw new Error(`Error getting user stats: ${error.message}`);
    }
  }

  /** Insert a new progress event */
  static async create (data) {
    try {
      const {
        userId,
        challengeId = null,
        eventType,
        pointsEarned = 0,
        metadata = {},
      } = data;

      const sql = `
        INSERT INTO progress_events (
          user_id, challenge_id, event_type,
          points_earned, metadata, timestamp_occurred,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
        RETURNING *
      `;
      const params = [userId, challengeId, eventType, pointsEarned, metadata];
      const result = await db.query(sql, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating progress event: ${error.message}`);
    }
  }

  /** Update an existing event (optional) */
  static async update (eventId, data) {
    try {
      const sets = [];
      const params = [eventId];
      let i = 1;

      const map = {
        eventType: 'event_type',
        pointsEarned: 'points_earned',
        metadata: 'metadata',
      };

      Object.entries(map).forEach(([key, col]) => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          params.push(data[key]);
          sets.push(`${col} = $${++i}`);
        }
      });

      if (sets.length === 0) return null;

      const sql = `
        UPDATE progress_events
        SET ${sets.join(', ')},
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(sql, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating progress event: ${error.message}`);
    }
  }

  /** Get leaderboard-like data (summarized from user_statistics) */
  static async getLeaderboardData (limit = 10) {
    try {
      const sql = `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          us.total_points,
          us.total_challenges_completed,
          us.average_score
        FROM users u
        LEFT JOIN user_statistics us ON us.user_id = u.id
        WHERE u.is_active = true
        ORDER BY us.total_points DESC NULLS LAST,
                 us.total_challenges_completed DESC NULLS LAST,
                 us.average_score DESC NULLS LAST
        LIMIT $1
      `;
      const result = await db.query(sql, [limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting leaderboard data: ${error.message}`);
    }
  }
}

module.exports = Progress;
