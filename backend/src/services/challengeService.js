/**
 * Challenge Service - Business logic layer using Prisma ORM
 *
 * Provides type-safe database operations for Challenge model including:
 * - CRUD operations with goal relationships
 * - Goal-linked challenge management
 * - Filtering and search capabilities
 * - Proper error handling and validation
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const challengeService = {
  /**
   * Get all challenges with optional filtering and goal relationships
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of challenge objects with goal relationships
   */
  getAllChallenges: async (filters = {}) => {
    try {
      const where = {};

      // Apply filters
      if (filters.category) where.category = filters.category;
      if (filters.difficulty) where.difficultyLevel = filters.difficulty;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;
      if (filters.goalId) where.goalId = parseInt(filters.goalId);
      if (filters.userId) where.createdBy = parseInt(filters.userId);

      const challenges = await prisma.challenge.findMany({
        where,
        include: {
          goal: {
            select: {
              id: true,
              title: true,
              category: true,
              difficultyLevel: true,
              userId: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: [
          { difficultyLevel: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      return challenges;
    } catch (error) {
      throw new Error(`Error fetching challenges: ${error.message}`);
    }
  },

  /**
   * Get challenge by ID with goal and user relationships
   * @param {number} challengeId - Challenge ID
   * @returns {Promise<Object>} Challenge object with relationships
   */
  getChallengeById: async (challengeId) => {
    try {
      const challenge = await prisma.challenge.findUnique({
        where: { id: parseInt(challengeId) },
        include: {
          goal: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              difficultyLevel: true,
              userId: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return challenge;
    } catch (error) {
      throw new Error(`Error fetching challenge: ${error.message}`);
    }
  },

  /**
   * Create new challenge with optional goal linking
   * @param {Object} challengeData - Challenge data
   * @param {number} userId - ID of user creating the challenge
   * @returns {Promise<Object>} Created challenge object
   */
  createChallenge: async (challengeData, userId) => {
    try {
      const data = {
        title: challengeData.title,
        description: challengeData.description,
        instructions: challengeData.instructions || challengeData.description || 'No instructions provided',
        category: challengeData.category,
        difficultyLevel: challengeData.difficulty_level || challengeData.difficultyLevel || 'medium',
        estimatedTimeMinutes: challengeData.estimated_time_minutes || challengeData.estimatedTimeMinutes,
        pointsReward: challengeData.points_reward || challengeData.pointsReward || 10,
        maxAttempts: challengeData.max_attempts || challengeData.maxAttempts || 3,
        requiresPeerReview: challengeData.requires_peer_review || challengeData.requiresPeerReview || false,
        isActive: challengeData.is_active !== undefined ? challengeData.is_active : true,
        tags: challengeData.tags || [],
        prerequisites: challengeData.prerequisites || [],
        learningObjectives: challengeData.learning_objectives || challengeData.learningObjectives || [],
        createdBy: userId,
      };

      // Link to goal if provided
      if (challengeData.goal_id || challengeData.goalId) {
        data.goalId = parseInt(challengeData.goal_id || challengeData.goalId);

        // Verify goal exists and belongs to the user
        const goal = await prisma.goal.findFirst({
          where: {
            id: data.goalId,
            userId: userId,
          },
        });

        if (!goal) {
          throw new Error('Goal not found or you do not have permission to link to this goal');
        }
      }

      const challenge = await prisma.challenge.create({
        data,
        include: {
          goal: {
            select: {
              id: true,
              title: true,
              category: true,
              difficultyLevel: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return challenge;
    } catch (error) {
      throw new Error(`Error creating challenge: ${error.message}`);
    }
  },

  /**
   * Update existing challenge
   * @param {number} challengeId - Challenge ID
   * @param {Object} updateData - Data to update
   * @param {number} userId - ID of user making the update
   * @returns {Promise<Object>} Updated challenge object
   */
  updateChallenge: async (challengeId, updateData, userId) => {
    try {
      // Check if challenge exists and user has permission
      const existingChallenge = await prisma.challenge.findUnique({
        where: { id: parseInt(challengeId) },
      });

      if (!existingChallenge) {
        throw new Error('Challenge not found');
      }

      if (existingChallenge.createdBy !== userId) {
        throw new Error('You do not have permission to update this challenge');
      }

      const data = {};

      // Map fields for update
      if (updateData.title) data.title = updateData.title;
      if (updateData.description) data.description = updateData.description;
      if (updateData.instructions) data.instructions = updateData.instructions;
      if (updateData.category) data.category = updateData.category;
      if (updateData.difficulty_level || updateData.difficultyLevel) {
        data.difficultyLevel = updateData.difficulty_level || updateData.difficultyLevel;
      }
      if (updateData.estimated_time_minutes || updateData.estimatedTimeMinutes) {
        data.estimatedTimeMinutes = updateData.estimated_time_minutes || updateData.estimatedTimeMinutes;
      }
      if (updateData.points_reward || updateData.pointsReward) {
        data.pointsReward = updateData.points_reward || updateData.pointsReward;
      }
      if (updateData.max_attempts || updateData.maxAttempts) {
        data.maxAttempts = updateData.max_attempts || updateData.maxAttempts;
      }
      if (updateData.requires_peer_review !== undefined || updateData.requiresPeerReview !== undefined) {
        data.requiresPeerReview = updateData.requires_peer_review || updateData.requiresPeerReview;
      }
      if (updateData.is_active !== undefined || updateData.isActive !== undefined) {
        data.isActive = updateData.is_active !== undefined ? updateData.is_active : updateData.isActive;
      }
      if (updateData.tags) data.tags = updateData.tags;
      if (updateData.prerequisites) data.prerequisites = updateData.prerequisites;
      if (updateData.learning_objectives || updateData.learningObjectives) {
        data.learningObjectives = updateData.learning_objectives || updateData.learningObjectives;
      }

      // Handle goal linking/unlinking
      if (updateData.goal_id !== undefined || updateData.goalId !== undefined) {
        const goalId = updateData.goal_id || updateData.goalId;

        if (goalId) {
          // Verify goal exists and belongs to user
          const goal = await prisma.goal.findFirst({
            where: {
              id: parseInt(goalId),
              userId: userId,
            },
          });

          if (!goal) {
            throw new Error('Goal not found or you do not have permission to link to this goal');
          }

          data.goalId = parseInt(goalId);
        } else {
          // Unlink from goal
          data.goalId = null;
        }
      }

      const challenge = await prisma.challenge.update({
        where: { id: parseInt(challengeId) },
        data,
        include: {
          goal: {
            select: {
              id: true,
              title: true,
              category: true,
              difficultyLevel: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return challenge;
    } catch (error) {
      throw new Error(`Error updating challenge: ${error.message}`);
    }
  },

  /**
   * Delete challenge
   * @param {number} challengeId - Challenge ID
   * @param {number} userId - ID of user deleting the challenge
   * @returns {Promise<Object>} Deleted challenge object
   */
  deleteChallenge: async (challengeId, userId) => {
    try {
      // Check if challenge exists and user has permission
      const existingChallenge = await prisma.challenge.findUnique({
        where: { id: parseInt(challengeId) },
      });

      if (!existingChallenge) {
        throw new Error('Challenge not found');
      }

      if (existingChallenge.createdBy !== userId) {
        throw new Error('You do not have permission to delete this challenge');
      }

      const challenge = await prisma.challenge.delete({
        where: { id: parseInt(challengeId) },
      });

      return challenge;
    } catch (error) {
      throw new Error(`Error deleting challenge: ${error.message}`);
    }
  },

  /**
   * Get challenges for a specific goal
   * @param {number} goalId - Goal ID
   * @param {number} userId - User ID (to verify goal ownership)
   * @returns {Promise<Array>} Array of challenges linked to the goal
   */
  getChallengesByGoal: async (goalId, userId) => {
    try {
      // Verify goal exists and belongs to user
      const goal = await prisma.goal.findFirst({
        where: {
          id: parseInt(goalId),
          userId: userId,
        },
      });

      if (!goal) {
        throw new Error('Goal not found or you do not have permission to access this goal');
      }

      const challenges = await prisma.challenge.findMany({
        where: { goalId: parseInt(goalId) },
        include: {
          createdByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: [
          { difficultyLevel: 'asc' },
          { createdAt: 'asc' },
        ],
      });

      return challenges;
    } catch (error) {
      throw new Error(`Error fetching challenges for goal: ${error.message}`);
    }
  },
};

module.exports = challengeService;
