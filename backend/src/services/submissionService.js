// Submission service for managing code submissions and AI feedback
const { pool } = require('../database/connection');
const pino = require('pino');

const logger = pino({
  name: 'skillwise-submission-service',
  level: process.env.LOG_LEVEL || 'info',
});

const submissionService = {
  /**
   * Create a new submission record
   */
  submitSolution: async (submissionData) => {
    const {
      userId,
      challengeId,
      submissionText,
      submissionFiles = null,
      attemptNumber = 1,
    } = submissionData;

    try {
      logger.info('Creating submission:', { userId, challengeId, attemptNumber });

      const query = `
        INSERT INTO submissions (
          user_id, 
          challenge_id, 
          submission_text, 
          submission_files, 
          attempt_number,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const values = [
        userId,
        challengeId,
        submissionText,
        submissionFiles ? JSON.stringify(submissionFiles) : null,
        attemptNumber,
        'submitted',
      ];

      const result = await pool.query(query, values);
      
      logger.info('✅ Submission created successfully:', { submissionId: result.rows[0].id });
      
      return result.rows[0];
    } catch (error) {
      logger.error('❌ Error creating submission:', { error: error.message, stack: error.stack });
      throw error;
    }
  },

  /**
   * Create AI feedback for a submission
   */
  createAIFeedback: async (feedbackData) => {
    const {
      submissionId,
      feedbackText,
      feedbackType = 'general',
      confidenceScore = null,
      suggestions = [],
      strengths = [],
      improvements = [],
      aiModel = 'gpt-3.5-turbo',
      processingTimeMs = null,
    } = feedbackData;

    try {
      logger.info('Creating AI feedback:', { submissionId, feedbackType });

      const query = `
        INSERT INTO ai_feedback (
          submission_id,
          feedback_text,
          feedback_type,
          confidence_score,
          suggestions,
          strengths,
          improvements,
          ai_model,
          processing_time_ms
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const values = [
        submissionId,
        feedbackText,
        feedbackType,
        confidenceScore,
        suggestions,
        strengths,
        improvements,
        aiModel,
        processingTimeMs,
      ];

      const result = await pool.query(query, values);
      
      logger.info('✅ AI feedback created successfully:', { feedbackId: result.rows[0].id });
      
      return result.rows[0];
    } catch (error) {
      logger.error('❌ Error creating AI feedback:', { error: error.message, stack: error.stack });
      throw error;
    }
  },

  /**
   * Update submission with score and graded info
   */
  gradeSubmission: async (submissionId, gradeData) => {
    const { score, status = 'graded' } = gradeData;

    try {
      logger.info('Updating submission grade:', { submissionId, score, status });

      const query = `
        UPDATE submissions
        SET score = $1, 
            status = $2, 
            graded_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `;

      const values = [score, status, submissionId];
      const result = await pool.query(query, values);
      
      logger.info('✅ Submission grade updated:', { submissionId });
      
      return result.rows[0];
    } catch (error) {
      logger.error('❌ Error updating submission grade:', { error: error.message, stack: error.stack });
      throw error;
    }
  },

  // Get submission by ID
  getSubmissionById: async (submissionId) => {
    try {
      const query = `
        SELECT 
          s.*,
          af.feedback_text,
          af.feedback_type,
          af.suggestions,
          af.strengths,
          af.improvements,
          af.ai_model
        FROM submissions s
        LEFT JOIN ai_feedback af ON s.id = af.submission_id
        WHERE s.id = $1
      `;

      const result = await pool.query(query, [submissionId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('❌ Error getting submission:', { error: error.message });
      throw error;
    }
  },

  // Get user submissions
  getUserSubmissions: async (userId) => {
    try {
      const query = `
        SELECT * FROM submissions
        WHERE user_id = $1
        ORDER BY submitted_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      logger.error('❌ Error getting user submissions:', { error: error.message });
      throw error;
    }
  },

  // Get challenge submissions
  getChallengeSubmissions: async (challengeId) => {
    try {
      const query = `
        SELECT * FROM submissions
        WHERE challenge_id = $1
        ORDER BY submitted_at DESC
      `;
      const result = await pool.query(query, [challengeId]);
      return result.rows;
    } catch (error) {
      logger.error('❌ Error getting challenge submissions:', { error: error.message });
      throw error;
    }
  },

  // Update submission status
  updateSubmissionStatus: async (submissionId, status) => {
    try {
      const query = `
        UPDATE submissions
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [status, submissionId]);
      return result.rows[0];
    } catch (error) {
      logger.error('❌ Error updating submission status:', { error: error.message });
      throw error;
    }
  },

  /**
   * Get next attempt number for a user's challenge
   */
  getNextAttemptNumber: async (userId, challengeId) => {
    try {
      const query = `
        SELECT COALESCE(MAX(attempt_number), 0) + 1 as next_attempt
        FROM submissions
        WHERE user_id = $1 AND challenge_id = $2
      `;

      const result = await pool.query(query, [userId, challengeId]);
      return result.rows[0].next_attempt;
    } catch (error) {
      logger.error('❌ Error getting next attempt number:', { error: error.message });
      return 1; // Default to attempt 1 if error
    }
  },
};

module.exports = submissionService;
