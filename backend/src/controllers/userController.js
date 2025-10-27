// User controller
const userService = require('../services/userService');
const { AppError } = require('../middleware/errorHandler');

const userController = {
  // GET /api/users/profile
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const user = await userService.getUserById(userId);
      if (!user) return next(new AppError('User not found', 404, 'NOT_FOUND'));

      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/users/profile
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const { first_name, last_name } = req.body || {};
      if (!first_name && !last_name) {
        return next(new AppError('No updatable fields provided', 400, 'VALIDATION_ERROR'));
      }

      const updated = await userService.updateProfile(userId, { first_name, last_name });
      res.status(200).json({ user: updated });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/users/statistics
  getStatistics: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      const stats = await userService.getUserStats(userId);
      res.status(200).json({ userId, statistics: stats || {} });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/users/account
  deleteAccount: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401, 'NO_TOKEN'));

      await userService.deleteUser(userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
