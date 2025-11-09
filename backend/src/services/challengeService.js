// Challenge business logic using Prisma client
const prisma = require('../database/prisma');

const challengeService = {
  // Get challenges with optional filters: difficulty, subject, goalId
  getChallenges: async (filters = {}) => {
    const where = {};
    if (filters.goalId) where.goalId = Number(filters.goalId);
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.subject) where.subject = filters.subject;

    const challenges = await prisma.challenge.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return challenges;
  },

  getChallengeById: async (id) => {
    const challenge = await prisma.challenge.findUnique({ where: { id: Number(id) } });
    return challenge;
  },

  createChallenge: async (challengeData, userId) => {
    const data = {
      title: challengeData.title,
      description: challengeData.description || null,
      status: challengeData.status || null,
      difficulty: challengeData.difficulty || null,
      createdById: userId || challengeData.createdById || null,
      goalId: challengeData.goalId || challengeData.goal_id || null
    };
    const created = await prisma.challenge.create({ data });
    return created;
  },

  updateChallenge: async (challengeId, updateData) => {
    const data = {};
    if (typeof updateData.title !== 'undefined') data.title = updateData.title;
    if (typeof updateData.description !== 'undefined') data.description = updateData.description;
    if (typeof updateData.status !== 'undefined') data.status = updateData.status;
    if (typeof updateData.difficulty !== 'undefined') data.difficulty = updateData.difficulty;
    if (typeof updateData.goalId !== 'undefined') data.goalId = updateData.goalId;

    const updated = await prisma.challenge.update({
      where: { id: Number(challengeId) },
      data
    });
    return updated;
  },

  deleteChallenge: async (challengeId) => {
    const deleted = await prisma.challenge.delete({ where: { id: Number(challengeId) } });
    return deleted;
  },

  // Small helpers
  generatePersonalizedChallenges: async (userId) => {
    // basic implementation: all challenges for now
    return await prisma.challenge.findMany({ where: {}, orderBy: { createdAt: 'desc' } });
  },

  validateCompletion: async (challengeId, submissionData) => {
    // simple stub: always valid
    return { valid: true };
  },

  calculateDifficulty: (challenge) => {
    return challenge?.difficulty || 'medium';
  }
};

module.exports = challengeService;