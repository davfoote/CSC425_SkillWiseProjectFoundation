// src/services/userService.js
const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

/**
 * User Service
 * Handles user profile operations, account management, and statistics.
 */
const userService = {
  /**
   * Get user by ID
   */
  async getUserById (userId) {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');

    try {
      const query = `
        SELECT id, first_name, last_name, username, email, created_at, updated_at, role, active
        FROM users
        WHERE id = $1;
      `;
      const { rows } = await db.query(query, [userId]);

      if (rows.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return rows[0];
    } catch (err) {
      console.error('Error fetching user:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to retrieve user', 500, 'USER_FETCH_ERROR');
    }
  },

  /**
   * Update user profile information (first_name, last_name, username, avatar, etc.)
   */
  async updateProfile (userId, profileData) {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');
    if (!profileData || Object.keys(profileData).length === 0)
      throw new AppError('No fields provided for update', 400, 'NO_UPDATE_FIELDS');

    try {
      const allowedFields = ['first_name', 'last_name', 'username', 'avatar_url', 'bio', 'email'];
      const setClauses = [];
      const values = [];
      let idx = 1;

      for (const field of allowedFields) {
        if (profileData[field] !== undefined) {
          setClauses.push(`${field} = $${idx}`);
          values.push(profileData[field]);
          idx++;
        }
      }

      if (setClauses.length === 0) {
        throw new AppError('No valid fields to update', 400, 'INVALID_UPDATE_FIELDS');
      }

      values.push(userId);

      const query = `
        UPDATE users
        SET ${setClauses.join(', ')}, updated_at = NOW()
        WHERE id = $${idx}
        RETURNING id, first_name, last_name, username, email, avatar_url, bio, updated_at;
      `;

      const { rows } = await db.query(query, values);

      if (rows.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      return rows[0];
    } catch (err) {
      console.error('Error updating user profile:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to update user profile', 500, 'USER_UPDATE_ERROR');
    }
  },

  /**
   * Delete user account (soft delete or permanent)
   */
  async deleteUser (userId, softDelete = true) {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');

    try {
      if (softDelete) {
        // Soft delete (mark as inactive)
        const { rows } = await db.query(
          'UPDATE users SET active = false, updated_at = NOW() WHERE id = $1 RETURNING id, email;',
          [userId],
        );

        if (rows.length === 0) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

        return { message: 'Account deactivated successfully', user: rows[0] };
      } else {
        // Hard delete (remove completely)
        const { rowCount } = await db.query('DELETE FROM users WHERE id = $1;', [userId]);
        if (rowCount === 0) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
        return { message: 'Account permanently deleted' };
      }
    } catch (err) {
      console.error('Error deleting user:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to delete user account', 500, 'USER_DELETE_ERROR');
    }
  },

  /**
   * Retrieve user statistics (progress summary, achievements, etc.)
   */
  async getUserStats (userId) {
    if (!userId) throw new AppError('User ID is required', 400, 'INVALID_INPUT');

    try {
      const query = `
        SELECT
          us.user_id,
          us.total_points,
          us.challenges_completed,
          us.goals_completed,
          us.streak_days,
          us.last_login,
          us.updated_at
        FROM user_statistics us
        WHERE user_id = $1;
      `;
      const { rows } = await db.query(query, [userId]);

      if (rows.length === 0) {
        // Fallback: build initial stats object if not yet tracked
        return {
          user_id: userId,
          total_points: 0,
          challenges_completed: 0,
          goals_completed: 0,
          streak_days: 0,
          last_login: null,
        };
      }

      return rows[0];
    } catch (err) {
      console.error('Error fetching user stats:', err.message);
      throw new AppError('Failed to fetch user statistics', 500, 'USER_STATS_ERROR');
    }
  },
};

module.exports = userService;
