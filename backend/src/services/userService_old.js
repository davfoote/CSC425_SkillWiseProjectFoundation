// User service for database operations
const bcrypt = require('bcryptjs');
const prisma = require('../database/prisma');

const userService = {
  // Create a new user with hashed password
  async createUser({ email, firstName, lastName, password }) {
    try {
      console.log('Creating user:', email);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Hash password with a reasonable salt rounds
      console.log('Hashing password...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Password hashed successfully');
      
      // Create user in database
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          // Don't return password
        }
      });
      
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
      const user = await prisma.user.findUnique({
        where: { email }
      });
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
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          // Don't return password
        }
      });
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      throw error;
    }
  }
};

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(userId);
    const { rows } = await db.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, first_name, last_name, email, created_at, updated_at`,
      values
    );

    return rows[0];
  },

  // TODO: Delete user account
  deleteUser: async (userId) => {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  },

  // TODO: Get user statistics
  getUserStats: async (userId) => {
    // This would integrate with user_statistics table
    const { rows } = await db.query(
      'SELECT * FROM user_statistics WHERE user_id = $1',
      [userId]
    );
    return rows[0] || null;
  },
};

module.exports = userService;