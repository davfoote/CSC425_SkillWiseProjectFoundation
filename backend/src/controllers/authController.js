// TODO: Implement authentication controller with login, register, logout, refresh token endpoints

// Authentication controller with proper database integration
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const authController = {
  // Login endpoint with database lookup and password verification
  login: async (req, res, next) => {
    try {
      const { email, password } = req.validated.body;
      
      console.log('Login attempt for:', email);
      
      // Find user in database
      const user = await userService.findUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password',
          timestamp: new Date().toISOString()
        });
      }
      
      // Verify password
      const isValidPassword = await userService.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Invalid email or password',
          timestamp: new Date().toISOString()
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '24h' }
      );
      
      console.log('Login successful for user:', user.id);
      
      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error during login',
        timestamp: new Date().toISOString()
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
        password
      });
      
      console.log('User registered successfully:', user.id);
      
      res.status(201).json({
        message: 'Account created successfully',
        user,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User already exists with this email') {
        return res.status(409).json({
          message: 'An account with this email already exists',
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(500).json({
        message: 'Internal server error during registration',
        timestamp: new Date().toISOString()
      });
    }
  },

  // Signup endpoint (alias for register for frontend compatibility)
  signup: async (req, res, next) => {
    return authController.register(req, res, next);
  },

  // Logout endpoint (for JWT, this is mainly client-side)
  logout: async (req, res, next) => {
    try {
      // With JWT, logout is primarily handled on the client side
      // by removing the token from localStorage
      // In a production app, you might want to blacklist tokens
      
      console.log('Logout request received');
      
      res.status(200).json({
        message: 'Logout successful',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        message: 'Internal server error during logout',
        timestamp: new Date().toISOString()
      });
    }
  },

  // TODO: Add refresh token endpoint
  refreshToken: async (req, res, next) => {
    // Implementation needed for refresh tokens
    res.status(501).json({ 
      message: 'Refresh token endpoint not implemented yet',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = authController;