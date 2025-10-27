// tests/unit/utils/validators.test.js

const validators = require('../../../src/utils/validators');

describe('Validators Utility', () => {
  describe('validateEmail', () => {
    it('returns true for valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'first.last@domain.co',
        'name+tag@gmail.com',
        'test123@sub.domain.org',
        'my_email@domain.io',
      ];

      validEmails.forEach(email => {
        expect(validators.validateEmail(email)).toBe(true);
      });
    });

    it('returns false for invalid email formats', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'user@.com',
        'user@domain',
        'userdomain.com',
        'user@domain..com',
        'user@@domain.com',
      ];

      invalidEmails.forEach(email => {
        expect(validators.validateEmail(email)).toBe(false);
      });
    });

    it('returns false for empty or null input', () => {
      expect(validators.validateEmail('')).toBe(false);
      expect(validators.validateEmail(null)).toBe(false);
      expect(validators.validateEmail(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns true for strong passwords', () => {
      const strongPasswords = [
        'Password123',
        'Str0ng!Pass',
        'HelloWorld9',
        'Myp@ssw0rd1',
        'XyZ123abc',
      ];

      strongPasswords.forEach(pass => {
        expect(validators.validatePassword(pass)).toBe(true);
      });
    });

    it('returns false for weak passwords', () => {
      const weakPasswords = [
        'short',
        'password',
        '12345678',
        'abcdefghi',
        'PASSWORD',
        'pass123', // too short and missing uppercase
        'Pass',    // missing number
        '',        // empty string
      ];

      weakPasswords.forEach(pass => {
        expect(validators.validatePassword(pass)).toBe(false);
      });
    });

    it('enforces at least 8 characters, one uppercase, one lowercase, and one number', () => {
      expect(validators.validatePassword('Abcdefg1')).toBe(true);
      expect(validators.validatePassword('abcdefg1')).toBe(false); // missing uppercase
      expect(validators.validatePassword('ABCDEFG1')).toBe(false); // missing lowercase
      expect(validators.validatePassword('Abcdefgh')).toBe(false); // missing number
    });
  });
});
