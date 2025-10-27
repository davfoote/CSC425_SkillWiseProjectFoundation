// Challenges controller
const challengeService = require('../services/challengeService');
const { AppError } = require('../middleware/errorHandler');

const isAdmin = (req) => req.user && req.user.role === 'admin';

const challengeController = {
  // GET /api/challenges
  getChallenges: async (req, res, next) => {
    try {
      const filters = {
        category: req.query.category,
        difficulty: req.query.difficulty, // 'easy' | 'medium' | 'hard'
        subject: req.query.subject,
        active: typeof req.query.active === 'string' ? req.query.active === 'true' : undefined,
        q: req.query.q, // optional search text
      };
      const challenges = await challengeService.getChallenges(filters);
      res.status(200).json({ items: challenges });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/challenges/:id
  getChallengeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const challenge = await challengeService.getChallengeById(id);
      if (!challenge) return next(new AppError('Challenge not found', 404, 'NOT_FOUND'));

      res.status(200).json({ challenge });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/challenges  (admin)
  createChallenge: async (req, res, next) => {
    try {
      if (!isAdmin(req)) return next(new AppError('Forbidden', 403, 'INSUFFICIENT_PERMISSIONS'));

      const {
        title,
        description,
        instructions,
        category,
        difficulty = 'medium',
        estimatedTimeMinutes,
        pointsReward = 10,
        maxAttempts = 3,
        requiresPeerReview = false,
        tags,
        prerequisites,
        learningObjectives,
        subject,
        type,
        content,
      } = req.body || {};

      if (!title || !description || !instructions || !category) {
        return next(new AppError('title, description, instructions, category are required', 400, 'VALIDATION_ERROR'));
      }

      const payload = {
        title,
        description,
        instructions,
        category,
        difficulty,
        estimated_time_minutes: estimatedTimeMinutes,
        points_reward: pointsReward,
        max_attempts: maxAttempts,
        requires_peer_review: requiresPeerReview,
        tags,
        prerequisites,
        learning_objectives: learningObjectives,
        subject,
        type,
        content,
        created_by: req.user?.id,
      };

      const created = await challengeService.createChallenge(payload);
      res.status(201).json({ challenge: created });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/challenges/:id  (admin)
  updateChallenge: async (req, res, next) => {
    try {
      if (!isAdmin(req)) return next(new AppError('Forbidden', 403, 'INSUFFICIENT_PERMISSIONS'));
      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        instructions: req.body.instructions,
        category: req.body.category,
        difficulty: req.body.difficulty,
        estimated_time_minutes: req.body.estimatedTimeMinutes,
        points_reward: req.body.pointsReward,
        max_attempts: req.body.maxAttempts,
        requires_peer_review: req.body.requiresPeerReview,
        tags: req.body.tags,
        prerequisites: req.body.prerequisites,
        learning_objectives: req.body.learningObjectives,
        subject: req.body.subject,
        type: req.body.type,
        content: req.body.content,
        is_active: req.body.isActive,
      };

      const updated = await challengeService.updateChallenge(id, updateData);
      if (!updated) return next(new AppError('Challenge not found', 404, 'NOT_FOUND'));

      res.status(200).json({ challenge: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/challenges/:id  (admin)
  deleteChallenge: async (req, res, next) => {
    try {
      if (!isAdmin(req)) return next(new AppError('Forbidden', 403, 'INSUFFICIENT_PERMISSIONS'));
      const { id } = req.params;
      if (!id) return next(new AppError('id is required', 400, 'VALIDATION_ERROR'));

      const deleted = await challengeService.deleteChallenge(id);
      if (!deleted) return next(new AppError('Challenge not found', 404, 'NOT_FOUND'));

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = challengeController;
