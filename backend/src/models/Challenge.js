// src/models/Challenge.js
const db = require('../database/connection');

class Challenge {
  /**
   * List challenges with optional filters + pagination.
   * filters: { category, difficulty, isActive, search, tag, limit, offset }
   */
  static async findAll (filters = {}) {
    try {
      const {
        category,
        difficulty,         // maps to difficulty_level
        isActive,           // boolean
        search,             // ILIKE on title/description/instructions
        tag,                // match any tag in tags[]
        limit = 50,
        offset = 0,
      } = filters;

      const where = [];
      const params = [];

      if (category) {
        params.push(category);
        where.push(`category = $${params.length}`);
      }
      if (difficulty) {
        params.push(difficulty);
        where.push(`difficulty_level = $${params.length}`);
      }
      if (typeof isActive === 'boolean') {
        params.push(isActive);
        where.push(`is_active = $${params.length}`);
      }
      if (search) {
        params.push(`%${search}%`);
        where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length} OR instructions ILIKE $${params.length})`);
      }
      if (tag) {
        // match ANY tag
        params.push(tag);
        where.push(`$${params.length} = ANY(tags)`);
      }

      // pagination
      params.push(limit);
      params.push(offset);

      const sql = `
        SELECT
          id, title, description, instructions, category,
          difficulty_level, estimated_time_minutes, points_reward,
          max_attempts, requires_peer_review, is_active, created_by,
          tags, prerequisites, learning_objectives,
          created_at, updated_at
        FROM challenges
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY difficulty_level, created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `;

      const result = await db.query(sql, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding challenges: ${error.message}`);
    }
  }

  static async findById (challengeId) {
    try {
      const query = `
        SELECT
          id, title, description, instructions, category,
          difficulty_level, estimated_time_minutes, points_reward,
          max_attempts, requires_peer_review, is_active, created_by,
          tags, prerequisites, learning_objectives,
          created_at, updated_at
        FROM challenges
        WHERE id = $1
      `;
      const result = await db.query(query, [challengeId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding challenge: ${error.message}`);
    }
  }

  static async findByDifficulty (difficultyLevel) {
    try {
      const query = `
        SELECT
          id, title, description, instructions, category,
          difficulty_level, estimated_time_minutes, points_reward,
          max_attempts, requires_peer_review, is_active, created_by,
          tags, prerequisites, learning_objectives,
          created_at, updated_at
        FROM challenges
        WHERE difficulty_level = $1
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [difficultyLevel]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding challenges by difficulty: ${error.message}`);
    }
  }

  static async findByCategory (category) {
    try {
      const query = `
        SELECT
          id, title, description, instructions, category,
          difficulty_level, estimated_time_minutes, points_reward,
          max_attempts, requires_peer_review, is_active, created_by,
          tags, prerequisites, learning_objectives,
          created_at, updated_at
        FROM challenges
        WHERE category = $1
        ORDER BY difficulty_level, created_at DESC
      `;
      const result = await db.query(query, [category]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding challenges by category: ${error.message}`);
    }
  }

  static async create (data) {
    try {
      const {
        title,
        description,
        instructions,
        category,
        difficultyLevel = 'medium',
        estimatedTimeMinutes = null,
        pointsReward = 10,
        maxAttempts = 3,
        requiresPeerReview = false,
        isActive = true,
        createdBy = null,
        tags = [],
        prerequisites = [],
        learningObjectives = [],
      } = data;

      const query = `
        INSERT INTO challenges (
          title, description, instructions, category,
          difficulty_level, estimated_time_minutes, points_reward,
          max_attempts, requires_peer_review, is_active, created_by,
          tags, prerequisites, learning_objectives,
          created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14,
          NOW(), NOW()
        )
        RETURNING *
      `;

      const params = [
        title,
        description,
        instructions,
        category,
        difficultyLevel,
        estimatedTimeMinutes,
        pointsReward,
        maxAttempts,
        requiresPeerReview,
        isActive,
        createdBy,
        tags,                // TEXT[] via pg params (JS array)
        prerequisites,       // TEXT[]
        learningObjectives,  // TEXT[]
      ];

      const result = await db.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating challenge: ${error.message}`);
    }
  }

  static async update (challengeId, data) {
    try {
      // Build dynamic field list so we only update provided fields
      const sets = [];
      const params = [];
      let idx = 1;

      const map = {
        title: 'title',
        description: 'description',
        instructions: 'instructions',
        category: 'category',
        difficultyLevel: 'difficulty_level',
        estimatedTimeMinutes: 'estimated_time_minutes',
        pointsReward: 'points_reward',
        maxAttempts: 'max_attempts',
        requiresPeerReview: 'requires_peer_review',
        isActive: 'is_active',
        createdBy: 'created_by',
        tags: 'tags',
        prerequisites: 'prerequisites',
        learningObjectives: 'learning_objectives',
      };

      Object.entries(map).forEach(([key, column]) => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sets.push(`${column} = $${++idx}`);
          params.push(data[key]);
        }
      });

      if (sets.length === 0) {
        // nothing to update
        return await this.findById(challengeId);
      }

      const query = `
        UPDATE challenges
        SET ${sets.join(', ')},
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await db.query(query, [challengeId, ...params]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating challenge: ${error.message}`);
    }
  }

  static async delete (challengeId) {
    try {
      const query = 'DELETE FROM challenges WHERE id = $1 RETURNING *';
      const result = await db.query(query, [challengeId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting challenge: ${error.message}`);
    }
  }
}

module.exports = Challenge;
