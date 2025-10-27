// tests/unit/utils/jwt.test.js

const jwtUtils = require('../../../src/utils/jwt');

describe('JWT Utils', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('generateToken', () => {
    it('generates a JWT string', () => {
      const token = jwtUtils.generateToken({ id: 123, role: 'student' });
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // header.payload.signature
    });

    it('includes the correct payload (subset) when decoded', () => {
      const payload = { id: 42, email: 'user@example.com', role: 'student' };
      const token = jwtUtils.generateToken(payload);

      // decode *without* verifying signature (just to inspect claims quickly)
      const decoded = jwtUtils.decodeToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(42);
      expect(decoded.email).toBe('user@example.com');
      expect(decoded.role).toBe('student');
      // iat/exp will also be present but we don’t assert on exact values
    });
  });

  describe('verifyToken', () => {
    it('verifies a valid token and returns the full payload', () => {
      const token = jwtUtils.generateToken({ id: 7, role: 'admin' });
      const verified = jwtUtils.verifyToken(token);
      expect(verified).toBeDefined();
      expect(verified.id).toBe(7);
      expect(verified.role).toBe('admin');
      expect(verified.iat).toBeDefined();
      expect(verified.exp).toBeDefined();
    });

    it('rejects a tampered token', () => {
      const token = jwtUtils.generateToken({ id: 1, role: 'student' });

      // Tamper with the payload segment so the signature no longer matches
      const parts = token.split('.');
      const badPayload = Buffer.from(
        JSON.stringify({ id: 999, role: 'hacker' }),
        'utf8',
      ).toString('base64url');
      const tampered = [parts[0], badPayload, parts[2]].join('.');

      expect(() => jwtUtils.verifyToken(tampered)).toThrow();
    });
  });

  describe('refresh tokens', () => {
    it('generates and verifies a refresh token with the refresh secret', () => {
      const rt = jwtUtils.generateRefreshToken({ id: 55 });
      expect(typeof rt).toBe('string');

      const verified = jwtUtils.verifyRefreshToken(rt);
      expect(verified.id).toBe(55);
      expect(verified.exp).toBeDefined();
    });
  });
});
