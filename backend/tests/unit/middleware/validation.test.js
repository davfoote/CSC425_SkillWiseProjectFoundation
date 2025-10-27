// tests/unit/middleware/validation.test.js

const {
  loginValidation,
  registerValidation,
  goalValidation,
  challengeValidation,
} = require('../../../src/middleware/validation');

describe('Validation Middleware', () => {
  const makeRes = () => ({});
  const makeNext = () => jest.fn();

  const run = async (mw, body = {}, params = {}, query = {}) => {
    const req = { body, params, query };
    const res = makeRes();
    const next = makeNext();
    await mw(req, res, next);
    return { req, res, next };
  };

  describe('loginValidation', () => {
    it('validates correct login data', async () => {
      const { req, next } = await run(loginValidation, {
        email: 'valid@example.com',
        password: 'somepassword',
      });

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(); // no error
      expect(req.validated).toBeDefined();
      expect(req.validated.body.email).toBe('valid@example.com');
    });

    it('rejects invalid email format', async () => {
      const { next } = await run(loginValidation, {
        email: 'not-an-email',
        password: 'pw',
      });

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toMatch(/Invalid email format|Validation error/i);
    });

    it('rejects missing password', async () => {
      const { next } = await run(loginValidation, {
        email: 'valid@example.com',
      });

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toMatch(/Password is required|Validation error/i);
    });
  });

  describe('registerValidation', () => {
    const validBody = {
      email: 'new@user.com',
      password: 'StrongPass1',
      confirmPassword: 'StrongPass1',
      firstName: 'New',
      lastName: 'User',
    };

    it('validates registration data', async () => {
      const { req, next } = await run(registerValidation, validBody);

      expect(next).toHaveBeenCalledWith();
      expect(req.validated).toBeDefined();
      expect(req.validated.body.email).toBe('new@user.com');
    });

    it('enforces password requirements (weak password)', async () => {
      const weak = { ...validBody, password: 'weak', confirmPassword: 'weak' };
      const { next } = await run(registerValidation, weak);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toMatch(/Password must contain at least one lowercase letter, one uppercase letter, and one number|at least 8/i);
    });

    it('rejects when passwords don\'t match', async () => {
      const mismatch = { ...validBody, confirmPassword: 'Different1' };
      const { next } = await run(registerValidation, mismatch);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toMatch(/Passwords don't match/i);
    });

    it('rejects overly long first name', async () => {
      const longFirst = { ...validBody, firstName: 'A'.repeat(51) };
      const { next } = await run(registerValidation, longFirst);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toMatch(/First name too long|Invalid input/i);
    });

    it('rejects invalid email', async () => {
      const badEmail = { ...validBody, email: 'nope' };
      const { next } = await run(registerValidation, badEmail);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.message).toMatch(/Invalid email format/i);
    });
  });

  // Optional: quick sanity checks for other exported validators

  describe('goalValidation (sanity)', () => {
    it('accepts minimal valid goal payload', async () => {
      const { next } = await run(goalValidation, { title: 'My Goal' });
      expect(next).toHaveBeenCalledWith();
    });

    it('rejects missing title', async () => {
      const { next } = await run(goalValidation, { description: 'No title' });
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('challengeValidation (sanity)', () => {
    it('accepts valid challenge payload', async () => {
      const body = {
        title: 'FizzBuzz',
        description: 'Write FizzBuzz',
        instructions: 'Implement function...',
        category: 'Programming',
        difficulty: 'medium',
        pointsReward: 10,
        maxAttempts: 3,
      };
      const { next } = await run(challengeValidation, body);
      expect(next).toHaveBeenCalledWith();
    });

    it('rejects when required fields missing', async () => {
      const { next } = await run(challengeValidation, { title: 'Only title' });
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
    });
  });
});
