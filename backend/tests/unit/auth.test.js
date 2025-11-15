const request = require('supertest');
const express = require('express');
const authController = require('../../../src/controllers/authController');
const userService = require('../../../src/services/userService');
const db = require('../../../src/database/connection');

// Mock the userService and database connection
jest.mock('../../src/services/userService');
jest.mock('../../src/database/connection', () => ({
  query: jest.fn(),
}));

// Simple validation middleware for tests
const mockValidation = {
  validateSignup: (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Missing required fields',
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Invalid email format',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Password must be at least 8 characters',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Passwords don\'t match',
      });
    }

    // Add validated body for controller
    req.validated = { body: req.body };
    next();
  },

  validateLogin: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Email and password required',
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation error: Invalid email format',
      });
    }

    // Add validated body for controller
    req.validated = { body: req.body };
    next();
  },
};

// Create test app with mocked dependencies
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Mock cookie parser for testing
  app.use((req, res, next) => {
    req.cookies = req.cookies || {};
    next();
  });

  // Auth routes
  app.post('/api/auth/signup', mockValidation.validateSignup, authController.register);
  app.post('/api/auth/login', mockValidation.validateLogin, authController.login);
  app.post('/api/auth/logout', authController.logout);
  app.post('/api/auth/refresh', authController.refreshToken);

  return app;
};

describe('Authentication Controller Unit Tests', () => {
  let app;

  beforeAll(() => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  });

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    const validSignupData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'TestPassword123',
      confirmPassword: 'TestPassword123',
    };

    it('should create a new user with valid data', async () => {
      const mockUser = {
        id: 1,
        email: validSignupData.email,
        firstName: validSignupData.firstName,
        lastName: validSignupData.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userService.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupData)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Account created successfully',
        user: {
          email: validSignupData.email,
          firstName: validSignupData.firstName,
          lastName: validSignupData.lastName,
        },
      });

      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('password_hash');
      expect(userService.createUser).toHaveBeenCalledWith({
        firstName: validSignupData.firstName,
        lastName: validSignupData.lastName,
        email: validSignupData.email,
        password: validSignupData.password,
      });
    });

    it('should reject signup with missing required fields', async () => {
      const invalidData = {
        firstName: 'John',
        // lastName missing
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Validation error');
    });

    it('should reject signup with invalid email format', async () => {
      const invalidData = {
        ...validSignupData,
        email: 'invalid-email-format',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should reject signup with weak password', async () => {
      const invalidData = {
        ...validSignupData,
        password: 'weak',
        confirmPassword: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Password must be at least 8 characters');
    });

    it('should reject signup when passwords do not match', async () => {
      const invalidData = {
        ...validSignupData,
        confirmPassword: 'DifferentPass123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Passwords don\'t match');
    });

    it('should reject signup with duplicate email', async () => {
      userService.createUser.mockRejectedValue(new Error('User already exists with this email'));

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupData)
        .expect(409);

      expect(response.body.message).toBe('An account with this email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'TestPass123',
    };

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: loginData.email,
        firstName: 'Test',
        lastName: 'User',
        password_hash: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userService.findUserByEmail.mockResolvedValue(mockUser);
      userService.verifyPassword.mockResolvedValue(true);

      // Mock database calls for token storage
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Login successful',
        user: {
          email: loginData.email,
          firstName: 'Test',
          lastName: 'User',
        },
      });

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('password_hash');
      expect(userService.findUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(userService.verifyPassword).toHaveBeenCalledWith(loginData.password, mockUser.password_hash);
    });

    it('should reject login with invalid email', async () => {
      userService.findUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: loginData.password,
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login with invalid password', async () => {
      const mockUser = {
        id: 1,
        email: loginData.email,
        password_hash: 'hashedPassword',
      };

      userService.findUserByEmail.mockResolvedValue(mockUser);
      userService.verifyPassword.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginData.email,
          password: 'WrongPassword123',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: loginData.password,
        })
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Validation error');
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginData.email,
        })
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Validation error');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: loginData.password,
        })
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('Invalid email format');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully and clear cookies', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Logout successful',
      });
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle logout without authentication gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Logout successful',
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should reject refresh with missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .expect(401);

      expect(response.body.message).toContain('Refresh token required');
    });

    it('should reject refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refreshToken=invalid-token'])
        .expect(401);

      expect(response.body.message).toContain('Refresh token required');
    });
  });
});
