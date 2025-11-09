const prisma = require('../database/prisma');

const challengeService = {
  getChallenges: async (filters = {}) => {
    const where = {};
    if (filters.difficulty_level) where.difficultyLevel = filters.difficulty_level;
    if (filters.category) where.category = filters.category;
    const challenges = await prisma.challenge.findMany({ where, orderBy: { createdAt: 'desc' } });
    return challenges;
  },

  generatePersonalizedChallenges: async (userId) => {
    // Simple personalization: return active challenges
    const challenges = await prisma.challenge.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 5 });
    return challenges;
  },

  validateCompletion: async (challengeId, submissionData) => {
    const challenge = await prisma.challenge.findUnique({ where: { id: Number(challengeId) } });
    if (!challenge) throw new Error('Challenge not found');
    // Placeholder validation: accept any submission and award points
    return { valid: true, points: challenge.pointsReward || 0 };
  },

  calculateDifficulty: (challenge) => {
    return challenge.difficultyLevel || 'medium';
  }
};

module.exports = challengeService;