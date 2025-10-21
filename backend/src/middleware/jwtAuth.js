const jwt = require('jsonwebtoken');
const prisma = require('../database/prisma');
const { AppError } = require('./errorHandler');

/**
 * JWT Authentication Middleware
 * Validates access tokens from Authorization header or httpOnly cookies
 * Attaches user data to req.user for protected routes
 */
const authenticateToken = async (req, res, next) => {
  try {
    let token;

    // Try to get token from Authorization header first (for API calls)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Remove 'Bearer ' prefix
    }
    
    // Fallback to httpOnly cookie (for browser requests)
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError('Access token required', 401, 'UNAUTHORIZED'));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    
    // Get user data from database (exclude password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return next(new AppError('User not found', 401, 'UNAUTHORIZED'));
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid access token', 401, 'UNAUTHORIZED'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired', 401, 'TOKEN_EXPIRED'));
    }
    
    console.error('Authentication error:', error);
    return next(new AppError('Authentication failed', 401, 'UNAUTHORIZED'));
  }
};

/**
 * Optional Authentication Middleware
 * Like authenticateToken but doesn't fail if no token provided
 * Sets req.user if valid token found, otherwise continues without user
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
    
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(); // Continue without user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (user) {
      req.user = user;
    }

    next();

  } catch (error) {
    // Silently continue without user if token is invalid
    next();
  }
};

/**
 * Generate Access Token (short-lived)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: '15m' } // Short-lived access token
  );
};

/**
 * Generate Refresh Token (long-lived)
 */
const generateRefreshToken = () => {
  return jwt.sign(
    { 
      type: 'refresh',
      timestamp: Date.now(),
      random: Math.random()
    },
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key',
    { expiresIn: '7d' } // Long-lived refresh token
  );
};

module.exports = {
  authenticateToken,
  optionalAuth,
  generateAccessToken,
  generateRefreshToken
};