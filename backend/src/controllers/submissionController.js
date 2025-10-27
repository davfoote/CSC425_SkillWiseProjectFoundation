// Submissions controller
const submissionService = require('../services/submissionService');
const { AppError } = require('../middleware/errorHandler');

const isAdmin = (req) => req.user && req.user.role === 'admin';

const submissionController = {
  // POST /api/submissions
  submitWork: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const {
        challengeId,
        submissionText,
        submissionFiles,   // optional JSON (e.g., [{name, url, type}])
        timeSpentMinutes,  // optional
      } = req.body || {};

      if (!challengeId) {
        return next(new AppError('challengeId is required', 400, 'VALIDATION_ERROR'));
      }
      if (!submissionText && !submissionFiles) {
        return next(new AppError('submissionText or submissionFiles is required', 400, 'VALIDATION_ERROR'));
      }

      const payload = {
        user_id: userId,
        challenge_id: challengeId,
        submission_text: submissionText ?? null,
        submission_files: submissionFiles ?? null,
        time_spent_minutes: typeof timeSpentMinutes === 'number' ? timeSpentMinutes : null,
      };

      const created = await submissionService.submitSolution(payload);
      res.status(201).json({ submission: created });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/submissions/:id
  getSubmission: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const submission = await submissionService.getSubmissionById(id);
      if (!submission) return next(new AppError('Submission not found', 404, 'NOT_FOUND'));

      // Basic ownership check (service can/should enforce stronger rules)
      const ownerId = submission.user_id ?? submission.userId;
      if (!isAdmin(req) && ownerId && ownerId !== userId) {
        return next(new AppError('Forbidden', 403, 'INSUFFICIENT_PERMISSIONS'));
      }

      res.status(200).json({ submission });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/submissions/user/:userId
  getUserSubmissions: async (req, res, next) => {
    try {
      const authUserId = req.user?.id;
      if (!authUserId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { userId } = req.params;
      if (!userId) return next(new AppError('userId is required', 400, 'VALIDATION_ERROR'));

      if (!isAdmin(req) && String(authUserId) !== String(userId)) {
        return next(new AppError('Forbidden', 403, 'INSUFFICIENT_PERMISSIONS'));
      }

      const items = await submissionService.getUserSubmissions(userId);
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/submissions/:id
  updateSubmission: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const {
        status,        // 'submitted' | 'in_review' | 'graded' | 'rejected' etc.
        score,         // optional integer 0..100
        feedback,      // optional text
        isFlagged,     // optional boolean
      } = req.body || {};

      // If grading info provided, prefer explicit grading path when available
      if (typeof score === 'number' || typeof feedback === 'string') {
        if (!isAdmin(req)) {
          return next(new AppError('Only admins or graders can grade submissions', 403, 'INSUFFICIENT_PERMISSIONS'));
        }
        if (!submissionService.gradeSubmission) {
          return next(new AppError('Grading service not available', 501, 'NOT_IMPLEMENTED'));
        }
        const graded = await submissionService.gradeSubmission(id, {
          score,
          feedback,
          is_flagged: typeof isFlagged === 'boolean' ? isFlagged : undefined,
          graded_by: userId,
        });
        if (!graded) return next(new AppError('Submission not found', 404, 'NOT_FOUND'));
        return res.status(200).json({ submission: graded });
      }

      // Otherwise, status-only or meta update
      if (!status && typeof isFlagged !== 'boolean') {
        return next(new AppError('Provide fields to update (status or isFlagged or grading fields)', 400, 'VALIDATION_ERROR'));
      }

      if (!submissionService.updateSubmissionStatus) {
        return next(new AppError('Update submission service not available', 501, 'NOT_IMPLEMENTED'));
      }

      const updated = await submissionService.updateSubmissionStatus(id, {
        status,
        is_flagged: typeof isFlagged === 'boolean' ? isFlagged : undefined,
        updated_by: userId,
      });
      if (!updated) return next(new AppError('Submission not found', 404, 'NOT_FOUND'));

      res.status(200).json({ submission: updated });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = submissionController;
