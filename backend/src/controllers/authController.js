// Authentication controller
const authService = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');

const REFRESH_COOKIE_NAME = 'refreshToken';

function getRefreshTokenFromRequest (req) {
  return (
    (req.body && req.body.refreshToken) ||
    req.headers['x-refresh-token'] ||
    (req.cookies && req.cookies[REFRESH_COOKIE_NAME]) ||
    null
  );
}

function setRefreshCookie (res, token) {
  if (!token) return;
  const isProd = process.env.NODE_ENV === 'production';
  // Default to 7 days if not parsable; cookie maxAge is in ms
  const maxAgeMs = (() => {
    const raw = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const m = raw.match(/^(\d+)([smhd])$/); // s/m/h/d
    if (!m) return 7 * 24 * 60 * 60 * 1000;
    const n = Number(m[1]);
    const unit = m[2];
    const mult = { s: 1000, m: 60 * 1000, h: 3600 * 1000, d: 24 * 3600 * 1000 }[unit];
    return n * mult;
  })();

  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: maxAgeMs,
  });
}

function clearRefreshCookie (res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  });
}

const authController = {
  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return next(new AppError('Email and password are required', 400, 'VALIDATION_ERROR'));
      }

      const { user, accessToken, refreshToken } = await authService.login(email, password);
      setRefreshCookie(res, refreshToken);

      res.status(200).json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body || {};
      if (!email || !password || !firstName || !lastName) {
        return next(new AppError('email, password, firstName, lastName are required', 400, 'VALIDATION_ERROR'));
      }

      const { user, accessToken, refreshToken } = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      setRefreshCookie(res, refreshToken);
      res.status(201).json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/logout
  logout: async (req, res, next) => {
    try {
      const token = getRefreshTokenFromRequest(req);
      // Optionally revoke in DB if your service supports it:
      if (authService.logout) {
        try {
          await authService.logout(token);
        } catch (_) {
          // best-effort revoke; ignore failure
        }
      }
      clearRefreshCookie(res);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/refresh
  refreshToken: async (req, res, next) => {
    try {
      const token = getRefreshTokenFromRequest(req);
      if (!token) {
        return next(new AppError('Refresh token is required', 401, 'NO_REFRESH_TOKEN'));
      }

      const { accessToken, refreshToken: rotated } = await authService.refreshToken(token);
      if (rotated) setRefreshCookie(res, rotated);

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
