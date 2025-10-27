// Centralized error handling middleware
const logger = require('pino')({
  name: 'skillwise-error-handler',
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * Custom application error class for consistent API error handling
 */
class AppError extends Error {
  constructor (message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark as expected (not crash-level)

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Database and JWT error transformation helpers
 */
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_INPUT');

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue ? err.keyValue[field] : 'unknown';
  return new AppError(`Duplicate field value: ${field} = '${value}'. Please use another value.`, 400, 'DUPLICATE_FIELD');
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors || {}).map((el) => el.message);
  return new AppError(`Invalid input data. ${messages.join('. ')}`, 400, 'VALIDATION_ERROR');
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');

/**
 * Error response for development
 */
const sendErrorDev = (err, req, res) => {
  logger.error({
    msg: 'Development Error',
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    code: err.code,
    error: err,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Error response for production
 */
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    logger.warn({
      msg: 'Operational Error',
      message: err.message,
      code: err.code,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString(),
    });
  } else {
    logger.error({
      msg: 'Unknown Error',
      error: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Main error-handling middleware function
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message };

  // Normalize known error types
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Use different formats for dev vs prod
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

module.exports = errorHandler;
module.exports.AppError = AppError;
