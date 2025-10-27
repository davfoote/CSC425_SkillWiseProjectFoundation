// src/services/submissionService.js
const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

/**
 * Submission Service
 * Handles challenge submissions, grading, and status updates.
 */
const submissionService = {
  /**
   * Submit a new challenge solution
   * @param {object} submissionData
   * Expected keys:
   * - user_id
   * - challenge_id
   * - content (JSON or text)
   * - language (optional)
   * - attachments (optional)
   */
  async submitSolution (submissionData) {
    try {
      const { user_id, challenge_id, content, language = null, attachments = null } = submissionData;

      if (!user_id || !challenge_id || !content) {
        throw new AppError('Missing required fields for submission', 400, 'INVALID_SUBMISSION');
      }

      const query = `
        INSERT INTO submissions 
          (user_id, challenge_id, content, language, attachments, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, 'submitted', NOW(), NOW())
        RETURNING *;
      `;

      const result = await db.query(query, [
        user_id,
        challenge_id,
        JSON.stringify(content),
        language,
        attachments ? JSON.stringify(attachments) : null,
      ]);

      return result.rows[0];
    } catch (err) {
      console.error('Error creating submission:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to create submission', 500, 'SUBMISSION_CREATE_ERROR');
    }
  },

  /**
   * Get a submission by its ID
   */
  async getSubmissionById (submissionId) {
    try {
      const query = `
        SELECT s.*, c.title AS challenge_title, u.username AS user_name
        FROM submissions s
        LEFT JOIN challenges c ON s.challenge_id = c.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.id = $1;
      `;
      const result = await db.query(query, [submissionId]);
      if (result.rowCount === 0)
        throw new AppError('Submission not found', 404, 'SUBMISSION_NOT_FOUND');

      return result.rows[0];
    } catch (err) {
      console.error('Error fetching submission:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to fetch submission', 500, 'SUBMISSION_FETCH_ERROR');
    }
  },

  /**
   * Get all submissions from a user
   */
  async getUserSubmissions (userId) {
    try {
      const query = `
        SELECT s.*, c.title AS challenge_title
        FROM submissions s
        LEFT JOIN challenges c ON s.challenge_id = c.id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC;
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (err) {
      console.error('Error fetching user submissions:', err.message);
      throw new AppError('Failed to fetch user submissions', 500, 'USER_SUBMISSION_ERROR');
    }
  },

  /**
   * Get all submissions for a specific challenge
   */
  async getChallengeSubmissions (challengeId) {
    try {
      const query = `
        SELECT s.*, u.username, u.first_name, u.last_name
        FROM submissions s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.challenge_id = $1
        ORDER BY s.created_at DESC;
      `;
      const result = await db.query(query, [challengeId]);
      return result.rows;
    } catch (err) {
      console.error('Error fetching challenge submissions:', err.message);
      throw new AppError('Failed to fetch challenge submissions', 500, 'CHALLENGE_SUBMISSION_ERROR');
    }
  },

  /**
   * Grade a submission (manual or auto)
   * @param {number} submissionId
   * @param {object} gradingData - { score, feedback, graded_by }
   */
  async gradeSubmission (submissionId, gradingData) {
    try {
      const { score, feedback, graded_by } = gradingData;

      if (score == null || score < 0 || score > 100) {
        throw new AppError('Score must be between 0 and 100', 400, 'INVALID_SCORE');
      }

      const query = `
        UPDATE submissions
        SET score = $2,
            feedback = $3,
            graded_by = $4,
            status = 'graded',
            graded_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      const result = await db.query(query, [submissionId, score, feedback || null, graded_by || null]);

      if (result.rowCount === 0)
        throw new AppError('Submission not found', 404, 'SUBMISSION_NOT_FOUND');

      return result.rows[0];
    } catch (err) {
      console.error('Error grading submission:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to grade submission', 500, 'SUBMISSION_GRADE_ERROR');
    }
  },

  /**
   * Update submission status (e.g., "reviewed", "flagged", "resubmitted")
   */
  async updateSubmissionStatus (submissionId, status) {
    try {
      const validStatuses = ['submitted', 'in_review', 'graded', 'flagged', 'resubmitted'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid submission status', 400, 'INVALID_STATUS');
      }

      const query = `
        UPDATE submissions
        SET status = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      const result = await db.query(query, [submissionId, status]);
      if (result.rowCount === 0)
        throw new AppError('Submission not found', 404, 'SUBMISSION_NOT_FOUND');

      return result.rows[0];
    } catch (err) {
      console.error('Error updating submission status:', err.message);
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to update submission status', 500, 'SUBMISSION_STATUS_ERROR');
    }
  },
};

module.exports = submissionService;
