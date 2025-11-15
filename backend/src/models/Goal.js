const db = require('../database/connection');

class Goal {
  static async findByUserId (userId) {
    try {
      const query = `
        SELECT 
          id,
          user_id,
          title,
          description,
          category,
          difficulty_level,
          target_completion_date,
          is_completed,
          completion_date,
          progress_percentage,
          points_reward,
          is_public,
          created_at,
          updated_at
        FROM goals 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding goals for user: ${error.message}`);
    }
  }

  static async findById (goalId, userId = null) {
    try {
      let query = `
        SELECT 
          id,
          user_id,
          title,
          description,
          category,
          difficulty_level,
          target_completion_date,
          is_completed,
          completion_date,
          progress_percentage,
          points_reward,
          is_public,
          created_at,
          updated_at
        FROM goals 
        WHERE id = $1
      `;
      const params = [goalId];

      if (userId) {
        query += ' AND user_id = $2';
        params.push(userId);
      }

      const result = await db.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding goal: ${error.message}`);
    }
  }

  static async create (goalData) {
    try {
      const {
        user_id,
        title,
        description,
        category,
        difficulty_level = 'medium',
        target_completion_date,
        is_public = false,
        points_reward,
      } = goalData;

      const query = `
        INSERT INTO goals (
          user_id,
          title,
          description,
          category,
          difficulty_level,
          target_completion_date,
          is_public,
          points_reward,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING 
          id,
          user_id,
          title,
          description,
          category,
          difficulty_level,
          target_completion_date,
          is_completed,
          completion_date,
          progress_percentage,
          points_reward,
          is_public,
          created_at,
          updated_at
      `;

      const result = await db.query(query, [
        user_id,
        title,
        description,
        category,
        difficulty_level,
        target_completion_date,
        is_public,
        points_reward,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating goal: ${error.message}`);
    }
  }

  static async update (goalId, userId, updateData) {
    try {
      const allowedFields = [
        'title',
        'description',
        'category',
        'difficulty_level',
        'target_completion_date',
        'is_public',
        'progress_percentage',
        'is_completed',
      ];

      const updates = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add updated_at
      updates.push('updated_at = NOW()');

      // If completing goal, set completion_date and progress to 100
      if (updateData.is_completed) {
        updates.push('completion_date = NOW()');
        updates.push('progress_percentage = 100');
      }

      values.push(goalId, userId);

      const query = `
        UPDATE goals 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
        RETURNING 
          id,
          user_id,
          title,
          description,
          category,
          difficulty_level,
          target_completion_date,
          is_completed,
          completion_date,
          progress_percentage,
          points_reward,
          is_public,
          created_at,
          updated_at
      `;

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating goal: ${error.message}`);
    }
  }

  static async delete (goalId, userId) {
    try {
      const query = 'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id';
      const result = await db.query(query, [goalId, userId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting goal: ${error.message}`);
    }
  }
}

module.exports = Goal;
