// Peer review controller
const peerReviewService = require('../services/peerReviewService');
const { AppError } = require('../middleware/errorHandler');

// Helpers
const requireUser = (req, next) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Unauthorized', 401, 'NO_TOKEN');
  return userId;
};

const peerReviewController = {
  // GET /api/reviews/assignments
  getReviewAssignments: async (req, res, next) => {
    try {
      const userId = requireUser(req, next);
      if (!peerReviewService.getReviewAssignments) {
        return next(new AppError('Pending reviews service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const assignments = await peerReviewService.getReviewAssignments(userId);
      res.status(200).json({ assignments });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/reviews
  submitReview: async (req, res, next) => {
    try {
      const reviewerId = requireUser(req, next);
      const body = req.body || {};

      // Basic validation matching tests
      if (!body.submissionId) return next(new AppError('submissionId is required', 400, 'VALIDATION_ERROR'));
      if (!body.reviewText) return next(new AppError('reviewText is required', 400, 'VALIDATION_ERROR'));
      const nRating = Number(body.rating);
      if (!(nRating >= 1 && nRating <= 5)) {
        return next(new AppError('rating must be an integer between 1 and 5', 400, 'VALIDATION_ERROR'));
      }

      if (!peerReviewService.submitReview) {
        return next(new AppError('Create review service not available', 501, 'NOT_IMPLEMENTED'));
      }

      const created = await peerReviewService.submitReview(reviewerId, body);

      res.status(201).json({ review: created });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/reviews/received
  getReceivedReviews: async (req, res, next) => {
    try {
      const userId = requireUser(req, next);

      if (!peerReviewService.getReceivedReviews) {
        return next(new AppError('Received reviews service not available', 501, 'NOT_IMPLEMENTED'));
      }

      const reviews = await peerReviewService.getReceivedReviews(userId);
      return res.status(200).json({ reviews });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/reviews/history
  getReviewHistory: async (req, res, next) => {
    try {
      const reviewerId = requireUser(req, next);
      if (!peerReviewService.getReviewHistory) {
        return next(new AppError('Review history service not available', 501, 'NOT_IMPLEMENTED'));
      }
      const history = await peerReviewService.getReviewHistory(reviewerId);
      res.status(200).json({ history });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = peerReviewController;
