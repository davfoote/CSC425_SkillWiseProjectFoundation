// src/services/notificationService.js
const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

/**
 * Notification Service
 * Handles in-app notifications, status updates, and batch delivery.
 */
const notificationService = {
  /**
   * Send a single in-app notification to one user
   * @param {number} userId - The recipient user ID
   * @param {string} type - Notification type (e.g., 'achievement', 'goal', 'system')
   * @param {string} message - Short human-readable message
   * @param {object} data - Optional metadata or payload
   */
  async sendNotification (userId, type, message, data = {}) {
    try {
      if (!userId || !type || !message) {
        throw new AppError('Missing required fields for notification', 400, 'INVALID_NOTIFICATION');
      }

      const query = `
        INSERT INTO notifications (user_id, type, message, data, is_read, created_at)
        VALUES ($1, $2, $3, $4, false, NOW())
        RETURNING *;
      `;

      const result = await db.query(query, [userId, type, message, JSON.stringify(data)]);
      return result.rows[0];
    } catch (error) {
      console.error('Error sending notification:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to send notification', 500, 'NOTIFICATION_SEND_ERROR');
    }
  },

  /**
   * Retrieve all notifications for a user
   * @param {number} userId - The user ID
   */
  async getUserNotifications (userId) {
    try {
      const query = `
        SELECT id, type, message, data, is_read, created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
      `;
      const result = await db.query(query, [userId]);

      return result.rows.map((n) => ({
        id: n.id,
        type: n.type,
        message: n.message,
        data: n.data ? JSON.parse(n.data) : null,
        isRead: n.is_read,
        createdAt: n.created_at,
      }));
    } catch (error) {
      console.error('Error fetching user notifications:', error.message);
      throw new AppError('Failed to fetch notifications', 500, 'NOTIFICATION_FETCH_ERROR');
    }
  },

  /**
   * Mark a notification as read
   * @param {number} notificationId - Notification ID
   */
  async markAsRead (notificationId) {
    try {
      const query = `
        UPDATE notifications
        SET is_read = true, read_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;

      const result = await db.query(query, [notificationId]);
      if (result.rowCount === 0) {
        throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to mark notification as read', 500, 'NOTIFICATION_UPDATE_ERROR');
    }
  },

  /**
   * Send notifications to multiple users at once
   * @param {number[]} userIds - List of recipient user IDs
   * @param {object} notification - { type, message, data }
   */
  async sendBulkNotifications (userIds, notification) {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new AppError('User IDs must be a non-empty array', 400, 'INVALID_USER_IDS');
      }

      const { type, message, data = {} } = notification;
      if (!type || !message) {
        throw new AppError('Notification type and message are required', 400, 'INVALID_NOTIFICATION');
      }

      const values = userIds.map((id) => `(${id}, '${type}', '${message.replace(/'/g, '\'\'')}', '${JSON.stringify(data)}', false, NOW())`).join(', ');

      const query = `
        INSERT INTO notifications (user_id, type, message, data, is_read, created_at)
        VALUES ${values}
        RETURNING id, user_id, type, message, created_at;
      `;

      const result = await db.query(query);
      return {
        count: result.rowCount,
        notifications: result.rows,
      };
    } catch (error) {
      console.error('Error sending bulk notifications:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to send bulk notifications', 500, 'BULK_NOTIFICATION_ERROR');
    }
  },
};

module.exports = notificationService;
