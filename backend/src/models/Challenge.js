const db = require('../database/connection');

class Challenge {
  static async findAll () {
    try {
      const query = 'SELECT * FROM challenges ORDER BY difficulty_level, created_at DESC';
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding challenges: ${error.message}`);
    }
  }

  static async findById (challengeId) {
    try {
      const query = 'SELECT * FROM challenges WHERE id = $1';
      const result = await db.query(query, [challengeId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding challenge: ${error.message}`);
    }
  }

  static async findByDifficulty (difficulty) {
    try {
      const query = 'SELECT * FROM challenges WHERE difficulty_level = $1 ORDER BY created_at DESC';
      const result = await db.query(query, [difficulty]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding challenges by difficulty: ${error.message}`);
    }
  }

  static async findBySubject (subject) {
    try {
      const query = 'SELECT * FROM challenges WHERE category = $1 ORDER BY difficulty_level, created_at DESC';
      const result = await db.query(query, [subject]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding challenges by subject: ${error.message}`);
    }
  }

  static async create (challengeData) {
    try {
      const {
        title,
        description,
        instructions,
        category,
        difficulty_level = 'medium',
        estimated_time_minutes,
        points_reward = 10,
        max_attempts = 3,
        requires_peer_review = false,
        is_active = true,
        created_by,
        tags = [],
        prerequisites = [],
        learning_objectives = [],
      } = challengeData;

      const query = `
        INSERT INTO challenges (
          title, description, instructions, category, difficulty_level, 
          estimated_time_minutes, points_reward, max_attempts, requires_peer_review,
          is_active, created_by, tags, prerequisites, learning_objectives,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        RETURNING *
      `;

      const result = await db.query(query, [
        title, description, instructions, category, difficulty_level,
        estimated_time_minutes, points_reward, max_attempts, requires_peer_review,
        is_active, created_by, tags, prerequisites, learning_objectives,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating challenge: ${error.message}`);
    }
  }

  static async update (challengeId, updateData) {
    try {
      const {
        title,
        description,
        instructions,
        category,
        difficulty_level,
        estimated_time_minutes,
        points_reward,
        max_attempts,
        requires_peer_review,
        is_active,
        tags,
        prerequisites,
        learning_objectives,
      } = updateData;

      const query = `
        UPDATE challenges 
        SET title = COALESCE($2, title),
            description = COALESCE($3, description),
            instructions = COALESCE($4, instructions),
            category = COALESCE($5, category),
            difficulty_level = COALESCE($6, difficulty_level),
            estimated_time_minutes = COALESCE($7, estimated_time_minutes),
            points_reward = COALESCE($8, points_reward),
            max_attempts = COALESCE($9, max_attempts),
            requires_peer_review = COALESCE($10, requires_peer_review),
            is_active = COALESCE($11, is_active),
            tags = COALESCE($12, tags),
            prerequisites = COALESCE($13, prerequisites),
            learning_objectives = COALESCE($14, learning_objectives),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await db.query(query, [
        challengeId, title, description, instructions, category, difficulty_level,
        estimated_time_minutes, points_reward, max_attempts, requires_peer_review,
        is_active, tags, prerequisites, learning_objectives,
      ]);

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
