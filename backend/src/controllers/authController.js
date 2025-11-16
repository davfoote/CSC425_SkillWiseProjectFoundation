// Authentication controller with secure session management
const userService = require('../services/userService');
const { generateAccessToken, generateRefreshToken } = require('../middleware/jwtAuth');
const db = require('../database/connection');
const jwt = require('jsonwebtoken');

const authController = {
  // Login endpoint with secure session management
  login: async (req, res, next) => {
    try {
      const { email, password } = req.validated.body;

      console.log('Login attempt for:', email);

      // Find user in database
      const user = await userService.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password',
          timestamp: new Date().toISOString(),
        });
      }

      // Verify password
      const isValidPassword = await userService.verifyPassword(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Invalid email or password',
          timestamp: new Date().toISOString(),
        });
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken();

      // Clean up any existing refresh tokens for this user (prevent duplicates)
      await db.query('DELETE FROM refresh_tokens WHERE "userId" = $1', [user.id]);

      // Store refresh token in database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await db.query(
        'INSERT INTO refresh_tokens (token, "userId", "expiresAt") VALUES ($1, $2, $3)',
        [refreshToken, user.id, expiresAt],
      );

      // Set httpOnly cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log('Login successful for user:', user.id);

      // Return user data (without password_hash) and token for backward compatibility
      const { password_hash: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login successful',
        token: accessToken, // For backward compatibility with frontend
        user: userWithoutPassword,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error during login',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Register/Signup endpoint that saves to database
  register: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.validated.body;

      console.log('Registration attempt for:', email);

      // Create user in database with hashed password
      const user = await userService.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      console.log('User registered successfully:', user.id);

      res.status(201).json({
        message: 'Account created successfully',
        user,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Registration error:', error);

      if (error.message === 'User already exists with this email') {
        return res.status(409).json({
          message: 'An account with this email already exists',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(500).json({
        message: 'Internal server error during registration',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Signup endpoint (alias for register for frontend compatibility)
  signup: async (req, res, next) => {
    return authController.register(req, res, next);
  },

  // Logout endpoint with secure session cleanup
  logout: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      // Revoke refresh token if it exists
      if (refreshToken) {
        try {
          await db.query(
            'UPDATE refresh_tokens SET is_revoked = true WHERE token = $1',
            [refreshToken],
          );
        } catch (error) {
          console.error('Error revoking refresh token:', error);
        }
      }

      // Clear httpOnly cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      console.log('Logout successful - tokens cleared');

      res.status(200).json({
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        message: 'Internal server error during logout',
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Refresh token endpoint for generating new access tokens
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: 'Refresh token required',
          timestamp: new Date().toISOString(),
        });
      }

      // Verify refresh token in database
      const tokenQuery = `
        SELECT rt.*, u.id, u.email, u.first_name, u.last_name, u.created_at, u.updated_at
        FROM refresh_tokens rt
        JOIN users u ON rt.user_id = u.id
        WHERE rt.token = $1
      `;
      const result = await db.query(tokenQuery, [refreshToken]);
      const storedToken = result.rows[0];

      if (!storedToken || storedToken.is_revoked || storedToken.expires_at < new Date()) {
        return res.status(401).json({
          message: 'Invalid or expired refresh token',
          timestamp: new Date().toISOString(),
        });
      }

      // Generate new access token
      const user = {
        id: storedToken.id,
        email: storedToken.email,
        first_name: storedToken.first_name,
        last_name: storedToken.last_name,
        created_at: storedToken.created_at,
        updated_at: storedToken.updated_at,
      };
      const accessToken = generateAccessToken(user);

      // Set new access token cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      console.log('Access token refreshed for user:', storedToken.user.id);

      res.status(200).json({
        message: 'Token refreshed successfully',
        token: accessToken, // For backward compatibility
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        message: 'Internal server error during token refresh',
        timestamp: new Date().toISOString(),
      });
    }
  },
};

module.exports = authController;
