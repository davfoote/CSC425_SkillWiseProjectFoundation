// Minimal authentication controller: register implemented for signup compatibility
const db = require('../database/connection');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler');

const authController = {
  // login, logout, refresh are left as TODO stubs
  login: async (req, res, next) => {
    return next(new AppError('Not implemented', 501, 'NOT_IMPLEMENTED'));
  },

  // Register / Signup endpoint
  register: async (req, res, next) => {
    try {
      // Prefer validated data if available
      const body = (req.validated && req.validated.body) ? req.validated.body : req.body;
      const { email, password, firstName, lastName } = body;

      if (!email || !password || !firstName || !lastName) {
        return next(new AppError('Missing required fields', 400, 'MISSING_FIELDS'));
      }

      // Quick DB health check to provide clearer error if DB is not reachable
      const dbHealthy = await db.testConnection();
      if (!dbHealthy) {
        return next(new AppError('Database connection failed. Check DATABASE_URL and that Postgres is running.', 500, 'DB_CONNECTION_FAILED'));
      }

      // Check for existing user
      const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return next(new AppError('Email already in use', 409, 'EMAIL_EXISTS'));
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const insertQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, email, first_name AS "firstName", last_name AS "lastName", created_at
      `;

      const result = await db.query(insertQuery, [email, passwordHash, firstName, lastName]);
      const user = result.rows[0];

      return res.status(201).json({ message: 'User created', data: user });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    return next(new AppError('Not implemented', 501, 'NOT_IMPLEMENTED'));
  },

  refreshToken: async (req, res, next) => {
    return next(new AppError('Not implemented', 501, 'NOT_IMPLEMENTED'));
  }
};

module.exports = authController;