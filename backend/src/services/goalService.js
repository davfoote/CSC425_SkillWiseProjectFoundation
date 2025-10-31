// Goal business logic and database operations
const db = require('../database/connection');

const goalService = {
  // Get all goals for a user
  getUserGoals: async (userId) => {
    const query = `
      SELECT 
        id,
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
  },

  // Get single goal by ID and user ID
  getGoalById: async (goalId, userId) => {
    const query = `
      SELECT 
        id,
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
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await db.query(query, [goalId, userId]);
    return result.rows[0];
  },

  // Create new goal
  createGoal: async (goalData) => {
    const {
      user_id,
      title,
      description,
      category,
      difficulty_level = 'medium',
      target_completion_date,
      is_public = false
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
        points_reward
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id,
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

    // Calculate points based on difficulty
    const pointsReward = goalService.calculatePointsReward(difficulty_level);

    const values = [
      user_id,
      title,
      description,
      category,
      difficulty_level,
      target_completion_date,
      is_public,
      pointsReward
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Update existing goal
  updateGoal: async (goalId, userId, updateData) => {
    const allowedFields = [
      'title',
      'description', 
      'category',
      'difficulty_level',
      'target_completion_date',
      'is_public',
      'progress_percentage',
      'is_completed'
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
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // If completing goal, set completion_date
    if (updateData.is_completed) {
      updates.push(`completion_date = CURRENT_TIMESTAMP`);
      updates.push(`progress_percentage = 100`);
    }

    values.push(goalId, userId);

    const query = `
      UPDATE goals 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING 
        id,
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
  },

  // Delete goal
  deleteGoal: async (goalId, userId) => {
    const query = 'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await db.query(query, [goalId, userId]);
    return result.rows.length > 0;
  },

  // Update goal progress
  updateProgress: async (goalId, progress) => {
    const query = `
      UPDATE goals 
      SET progress_percentage = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING progress_percentage
    `;
    
    const result = await db.query(query, [goalId, progress]);
    return result.rows[0];
  },

  // Calculate points reward based on difficulty
  calculatePointsReward: (difficulty_level) => {
    const pointsMap = {
      'easy': 100,
      'medium': 200,
      'hard': 300
    };
    return pointsMap[difficulty_level] || 200;
  },

  // Calculate goal completion percentage
  calculateCompletion: (goal) => {
    if (goal.is_completed) {
      return 100;
    }
    return goal.progress_percentage || 0;
  }
};

module.exports = goalService;