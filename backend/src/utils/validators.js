// src/utils/validators.js
const { z } = require('zod');

// Email
const validateEmail = (email) => {
  const schema = z.string().email();
  return schema.safeParse(email).success;
};

// Password: return boolean (true if strong), keep a detailed validator as well
const validatePassword = (password) => {
  const schema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number');

  return schema.safeParse(password).success;
};

// Detailed password validator (returns { isValid, errors })
const validatePasswordDetailed = (password) => {
  const schema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number');

  const result = schema.safeParse(password);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.errors.map((e) => e.message),
  };
};

// Username
const validateUsername = (username) => {
  const schema = z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

  return schema.safeParse(username).success;
};

// Phone (permissive; allows +, spaces, dashes, parentheses, digits)
const validatePhoneNumber = (phone) => {
  const schema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format');
  return schema.safeParse(phone).success;
};

// URL
const validateUrl = (url) => {
  const schema = z.string().url();
  return schema.safeParse(url).success;
};

// Date: accept ISO date (YYYY-MM-DD) or ISO datetime (RFC3339)
const validateDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return true;

  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const isoDateTime =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

  if (typeof value !== 'string') return false;
  if (!isoDate.test(value) && !isoDateTime.test(value)) return false;

  const dt = new Date(value);
  return !Number.isNaN(dt.getTime());
};

// Mongo ObjectId (kept for compatibility)
const validateObjectId = (id) => {
  const schema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
  return schema.safeParse(id).success;
};

// Postgres UUID (useful with your schema)
const validateUUID = (id) => {
  const schema = z.string().uuid('Invalid UUID format');
  return schema.safeParse(id).success;
};

// Basic HTML entity escaping to mitigate XSS in text rendering
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')   // must go first
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '') // strip inline event handlers
    .trim();
};

// File upload validation (returns { isValid, errors: [] })
const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'],
  } = options;

  const errors = [];

  if (!file || typeof file !== 'object') {
    return { isValid: false, errors: ['No file provided'] };
  }

  if (typeof file.size !== 'number' || file.size <= 0) {
    errors.push('File size is invalid');
  } else if (file.size > maxSize) {
    errors.push(`File size exceeds ${Math.floor(maxSize / 1024 / 1024)}MB limit`);
  }

  const originalName = (file.originalname || '').toLowerCase();
  const hasDot = originalName.lastIndexOf('.') !== -1;
  const ext = hasDot ? originalName.substring(originalName.lastIndexOf('.')) : '';

  if (ext && !allowedExtensions.includes(ext)) {
    errors.push(`File extension ${ext} not allowed`);
  }

  if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype || 'unknown'} not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhoneNumber,
  validateUrl,
  validateDate,
  validateObjectId,
  validateUUID,
  sanitizeString,
  validateFileUpload,
  // Optional: export schemas you might want for tests later
  schemas: {
    email: z.string().email(),
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/),
  },
};
