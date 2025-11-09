// Challenge service: implements basic retrieval and simple personalization
const Challenge = require('../models/Challenge');

const challengeService = {
  // Get challenges; support simple filters: difficulty_level, category
  getChallenges: async (filters = {}) => {
    const { difficulty_level, category } = filters;
    if (difficulty_level) {
      return await Challenge.findByDifficulty(difficulty_level);
    }
    if (category) {
      return await Challenge.findBySubject(category);
    }
    return await Challenge.findAll();
  },

  // Generate a small personalized list based on user preferences (placeholder)
  generatePersonalizedChallenges: async (userId) => {
    // For now, just return the easiest active challenges as a placeholder
    const all = await Challenge.findAll();
    // Filter active and sort by difficulty_level then return top 5
    const active = all.filter(c => c.is_active !== false);
    return active.slice(0, 5);
  },

  // Validate completion - placeholder that returns success (real validation requires submission data)
  validateCompletion: async (challengeId, submissionData) => {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    // Placeholder: always valid
    return { valid: true, points: challenge.points_reward || 0 };
  },

  // Determine difficulty (normalize)
  calculateDifficulty: (challenge) => {
    return challenge.difficulty_level || 'medium';
  }
};

module.exports = challengeService;