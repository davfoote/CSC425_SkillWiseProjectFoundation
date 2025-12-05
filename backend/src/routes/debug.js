// Debug routes for testing error tracking and monitoring
const express = require('express');
const Sentry = require('@sentry/node');
const router = express.Router();

// Test endpoint to trigger a synchronous error
router.get('/error', (req, res, next) => {
  const error = new Error('Test error from /api/debug/error endpoint');
  error.statusCode = 500;
  error.isTest = true;
  next(error);
});

// Test endpoint to trigger an async error
router.get('/async-error', async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Test async error from /api/debug/async-error endpoint'));
      }, 100);
    });
  } catch (error) {
    error.statusCode = 500;
    error.isTest = true;
    next(error);
  }
});

// Test endpoint to trigger an unhandled promise rejection
router.get('/unhandled-rejection', (req, res) => {
  Promise.reject(new Error('Test unhandled rejection from /api/debug/unhandled-rejection'));
  res.status(200).json({ message: 'Unhandled rejection triggered' });
});

// Test endpoint to trigger a custom Sentry event
router.get('/sentry-message', (req, res) => {
  Sentry.captureMessage('Test message from /api/debug/sentry-message', 'info');
  res.status(200).json({ 
    success: true, 
    message: 'Test message sent to Sentry',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to trigger an error with custom context
router.get('/error-with-context', (req, res, next) => {
  Sentry.setContext('custom_context', {
    endpoint: '/api/debug/error-with-context',
    testData: {
      userId: 123,
      action: 'error_test',
      metadata: { foo: 'bar' }
    }
  });
  
  Sentry.setTag('test_type', 'error_with_context');
  Sentry.setTag('environment', process.env.NODE_ENV || 'development');
  
  const error = new Error('Test error with custom Sentry context');
  error.statusCode = 500;
  error.isTest = true;
  next(error);
});

// Test endpoint to simulate database error
router.get('/database-error', (req, res, next) => {
  const error = new Error('Simulated database connection error');
  error.name = 'DatabaseError';
  error.code = 'ECONNREFUSED';
  error.statusCode = 503;
  error.isTest = true;
  next(error);
});

// Test endpoint to simulate validation error
router.get('/validation-error', (req, res, next) => {
  const error = new Error('Validation failed: required field missing');
  error.name = 'ValidationError';
  error.statusCode = 400;
  error.isTest = true;
  error.details = {
    field: 'email',
    message: 'Email is required'
  };
  next(error);
});

// Health check for debug routes (doesn't trigger errors)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Debug routes are active',
    timestamp: new Date().toISOString(),
    sentryEnabled: !!process.env.SENTRY_DSN_BACKEND
  });
});

module.exports = router;
