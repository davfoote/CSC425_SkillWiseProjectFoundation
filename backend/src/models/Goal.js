// src/models/Goal.js
const db = require('../database/connection');

class Goal {
  static async findByUserId (userId) {
    try {
      const sql = `
        SELECT
          id, user_id, title, description, category, difficulty_level,
          target_completion_date, is_completed, completion_date,
          progress_percentage, points_reward, is_public,
          created_at, updated_at
        FROM goals
        WHERE user_id = $1
        ORDER BY created_at DESC
      `;
      const result = await db.query(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding goals for user: ${error.message}`);
    }
  }

  static async findById (goalId) {
    try {
      const sql = `
        SELECT
          id, user_id, title, description, category, difficulty_level,
          target_completion_date, is_completed, completion_date,
          progress_percentage, points_reward, is_public,
          created_at, updated_at
        FROM goals
        WHERE id = $1
      `;
      const result = await db.query(sql, [goalId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding goal: ${error.message}`);
    }
  }

  static async findPublic ({ category, difficulty, limit = 50, offset = 0 } = {}) {
    try {
      const where = ['is_public = true'];
      const params = [];

      if (category) {
        params.push(category);
        where.push(`category = $${params.length}`);
      }
      if (difficulty) {
        params.push(difficulty);
        where.push(`difficulty_level = $${params.length}`);
      }

      params.push(limit, offset);

      const sql = `
        SELECT
          id, user_id, title, description, category, difficulty_level,
          target_completion_date, is_completed, completion_date,
          progress_percentage, points_reward, is_public,
          created_at, updated_at
        FROM goals
        WHERE ${where.join(' AND ')}
        ORDER BY created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `;
      const result = await db.query(sql, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding public goals: ${error.message}`);
    }
  }

  static async create (data) {
    try {
      const {
        title,
        description = null,
        userId,                           // required
        category = null,
        difficultyLevel = 'medium',
        targetCompletionDate = null,      // date (YYYY-MM-DD)
        isCompleted = false,
        completionDate = null,
        progressPercentage = 0,           // 0..100
        pointsReward = 0,
        isPublic = false,
      } = data;

      const sql = `
        INSERT INTO goals (
          user_id, title, description, category, difficulty_level,
          target_completion_date, is_completed, completion_date,
          progress_percentage, points_reward, is_public,
          created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11,
          NOW(), NOW()
        )
        RETURNING *
      `;
      const params = [
        userId,
        title,
        description,
        category,
        difficultyLevel,
        targetCompletionDate,
        isCompleted,
        completionDate,
        progressPercentage,
        pointsReward,
        isPublic,
      ];

      const result = await db.query(sql, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating goal: ${error.message}`);
    }
  }

  static async update (goalId, data) {
    try {
      const sets = [];
      const params = [goalId];
      let i = 1;

      const map = {
        title: 'title',
        description: 'description',
        category: 'category',
        difficultyLevel: 'difficulty_level',
        targetCompletionDate: 'target_completion_date',
        isCompleted: 'is_completed',
        completionDate: 'completion_date',
        progressPercentage: 'progress_percentage',
        pointsReward: 'points_reward',
        isPublic: 'is_public',
      };

      Object.entries(map).forEach(([key, column]) => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          params.push(data[key]);
          sets.push(`${column} = $${++i}`);
        }
      });

      if (sets.length === 0) {
        return await this.findById(goalId);
      }

      const sql = `
        UPDATE goals
        SET ${sets.join(', ')},
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await db.query(sql, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating goal: ${error.message}`);
    }
  }

  static async delete (goalId) {
    try {
      const sql = 'DELETE FROM goals WHERE id = $1 RETURNING *';
      const result = await db.query(sql, [goalId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting goal: ${error.message}`);
    }
  }
}

module.exports = Goal;
