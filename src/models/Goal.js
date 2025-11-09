const db = require('../database/connection');

class Goal {
  static async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC';
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding goals for user: ${error.message}`);
    }
  }

  static async findById(goalId) {
    try {
      const query = 'SELECT * FROM goals WHERE id = $1';
      const result = await db.query(query, [goalId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding goal: ${error.message}`);
    }
  }

  static async create(goalData) {
    try {
      // Map incoming fields to DB columns. DB migration uses: target_completion_date, difficulty_level
      const { title, description, user_id, target_completion_date, difficulty_level } = goalData;
      const query = `
        INSERT INTO goals (title, description, user_id, target_completion_date, difficulty_level, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `;
      const result = await db.query(query, [title, description, user_id, target_completion_date, difficulty_level]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating goal: ${error.message}`);
    }
  }

  static async update(goalId, updateData) {
    try {
      // Map update fields to DB columns: target_completion_date, progress_percentage, is_completed
      const { title, description, target_completion_date, progress_percentage, is_completed, difficulty_level } = updateData;
      const query = `
        UPDATE goals 
        SET title = COALESCE($2, title),
            description = COALESCE($3, description),
            target_completion_date = COALESCE($4, target_completion_date),
            progress_percentage = COALESCE($5, progress_percentage),
            is_completed = COALESCE($6, is_completed),
            difficulty_level = COALESCE($7, difficulty_level),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [goalId, title, description, target_completion_date, progress_percentage, is_completed, difficulty_level]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating goal: ${error.message}`);
    }
  }

  static async delete(goalId) {
    try {
      const query = 'DELETE FROM goals WHERE id = $1 RETURNING *';
      const result = await db.query(query, [goalId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting goal: ${error.message}`);
    }
  }
}

module.exports = Goal;