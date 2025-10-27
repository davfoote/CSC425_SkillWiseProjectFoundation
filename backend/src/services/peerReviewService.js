// src/services/peerReviewService.js
const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

/**
 * Peer Review Service
 * Handles peer review creation, retrieval, updating, and rating.
 */
const peerReviewService = {
  /**
   * Create a new peer review
   * @param {object} reviewData - { submission_id, reviewer_id, comments, rating, criteria }
   */
  async createReview (reviewData) {
    try {
      const { submission_id, reviewer_id, comments, rating = null, criteria = {} } = reviewData;

      if (!submission_id || !reviewer_id || !comments) {
        throw new AppError('Missing required review fields', 400, 'INVALID_REVIEW');
      }

      const query = `
        INSERT INTO peer_reviews (submission_id, reviewer_id, comments, rating, criteria, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *;
      `;

      const result = await db.query(query, [
        submission_id,
        reviewer_id,
        comments.trim(),
        rating,
        JSON.stringify(criteria),
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating peer review:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create peer review', 500, 'REVIEW_CREATE_ERROR');
    }
  },

  /**
   * Get all reviews for a specific submission
   */
  async getReviewsForSubmission (submissionId) {
    try {
      const query = `
        SELECT pr.*, u.username AS reviewer_name
        FROM peer_reviews pr
        LEFT JOIN users u ON pr.reviewer_id = u.id
        WHERE pr.submission_id = $1
        ORDER BY pr.created_at DESC;
      `;
      const result = await db.query(query, [submissionId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching reviews for submission:', error.message);
      throw new AppError('Failed to fetch submission reviews', 500, 'REVIEW_FETCH_ERROR');
    }
  },

  /**
   * Get all reviews written by a specific reviewer
   */
  async getReviewsByReviewer (reviewerId) {
    try {
      const query = `
        SELECT pr.*, s.title AS submission_title
        FROM peer_reviews pr
        LEFT JOIN submissions s ON pr.submission_id = s.id
        WHERE pr.reviewer_id = $1
        ORDER BY pr.created_at DESC;
      `;
      const result = await db.query(query, [reviewerId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching reviewer reviews:', error.message);
      throw new AppError('Failed to fetch reviews by reviewer', 500, 'REVIEWER_FETCH_ERROR');
    }
  },

  /**
   * Update an existing review (e.g., edit comments or rating)
   */
  async updateReview (reviewId, updateData) {
    try {
      const { comments, rating, criteria } = updateData;

      const query = `
        UPDATE peer_reviews
        SET comments = COALESCE($2, comments),
            rating = COALESCE($3, rating),
            criteria = COALESCE($4, criteria),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      const result = await db.query(query, [
        reviewId,
        comments,
        rating,
        criteria ? JSON.stringify(criteria) : null,
      ]);

      if (result.rowCount === 0) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating review:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update review', 500, 'REVIEW_UPDATE_ERROR');
    }
  },

  /**
   * Delete a review by ID
   */
  async deleteReview (reviewId) {
    try {
      const query = 'DELETE FROM peer_reviews WHERE id = $1 RETURNING *;';
      const result = await db.query(query, [reviewId]);

      if (result.rowCount === 0) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting review:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete review', 500, 'REVIEW_DELETE_ERROR');
    }
  },

  /**
   * Get pending review assignments for a user
   * (Reviews assigned but not yet submitted)
   */
  async getPendingReviews (userId) {
    try {
      const query = `
        SELECT s.id AS submission_id, s.title, s.created_at AS submission_date
        FROM submissions s
        LEFT JOIN peer_reviews pr ON pr.submission_id = s.id AND pr.reviewer_id = $1
        WHERE s.user_id != $1 AND pr.id IS NULL
        ORDER BY s.created_at DESC;
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching pending reviews:', error.message);
      throw new AppError('Failed to get pending reviews', 500, 'PENDING_REVIEW_ERROR');
    }
  },

  /**
   * Submit a rating after review feedback
   * (e.g., author rating the reviewer’s helpfulness)
   */
  async submitRating (reviewId, rating) {
    try {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400, 'INVALID_RATING');
      }

      const query = `
        UPDATE peer_reviews
        SET feedback_rating = $2,
            feedback_rated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      const result = await db.query(query, [reviewId, rating]);

      if (result.rowCount === 0) {
        throw new AppError('Review not found', 404, 'REVIEW_NOT_FOUND');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error submitting review rating:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to submit review rating', 500, 'RATING_SUBMIT_ERROR');
    }
  },
};

module.exports = peerReviewService;
