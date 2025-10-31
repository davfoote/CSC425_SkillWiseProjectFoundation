// User service for database operations
const bcrypt = require('bcryptjs');
const db = require('../database/connection');

const userService = {
  // Create a new user with hashed password
  async createUser({ email, firstName, lastName, password }) {
    try {
      console.log('Creating user:', email);
      
      // Check if user already exists
      const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
      const existingUserResult = await db.query(existingUserQuery, [email]);
      
      if (existingUserResult.rows.length > 0) {
        throw new Error('User already exists with this email');
      }
      
      // Hash password with a reasonable salt rounds
      console.log('Hashing password...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Password hashed successfully');
      
      // Create user in database
      const createUserQuery = `
        INSERT INTO users (email, first_name, last_name, password_hash, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, first_name, last_name, created_at, updated_at
      `;
      
      const userResult = await db.query(createUserQuery, [
        email, 
        firstName, 
        lastName, 
        hashedPassword
      ]);
      
      const user = {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        firstName: userResult.rows[0].first_name,
        lastName: userResult.rows[0].last_name,
        created_at: userResult.rows[0].created_at,
        updated_at: userResult.rows[0].updated_at
      };
      
      console.log('User created successfully:', user.id);
      return user;
      
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  // Find user by email
  async findUserByEmail(email) {
    try {
      const query = 'SELECT id, email, first_name, last_name, password_hash, created_at, updated_at FROM users WHERE email = $1';
      const result = await db.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        first_name: result.rows[0].first_name,
        last_name: result.rows[0].last_name,
        password_hash: result.rows[0].password_hash,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      };
      
      return user;
    } catch (error) {
      console.error('Error finding user:', error.message);
      throw error;
    }
  },

  // Verify user password
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      console.log('Verifying password...');
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('Password verification result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error verifying password:', error.message);
      throw error;
    }
  },

  // Get user by ID (for JWT verification)
  async getUserById(userId) {
    try {
      const query = 'SELECT id, email, first_name, last_name, created_at, updated_at FROM users WHERE id = $1';
      const result = await db.query(query, [parseInt(userId)]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      };
      
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      throw error;
    }
  }
};

module.exports = userService;