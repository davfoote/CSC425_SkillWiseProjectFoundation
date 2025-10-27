// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

/**
 * Generates an access token (short-lived)
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
  } catch (err) {
    throw new AppError('Failed to generate access token', 500, 'TOKEN_GENERATION_ERROR');
  }
};

/**
 * Generates a refresh token (long-lived)
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
  } catch (err) {
    throw new AppError('Failed to generate refresh token', 500, 'REFRESH_TOKEN_ERROR');
  }
};

/**
 * Verifies an access token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Access token expired', 401, 'TOKEN_EXPIRED');
    }
    throw new AppError('Invalid access token', 401, 'INVALID_TOKEN');
  }
};

/**
 * Verifies a refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired', 401, 'REFRESH_EXPIRED');
    }
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
};

/**
 * Decodes token payload without verifying signature
 * (useful for non-critical inspection)
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (err) {
    throw new AppError('Failed to decode token', 400, 'TOKEN_DECODE_ERROR');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken,
};
