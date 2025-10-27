// src/services/challengeService.js
const Challenge = require('../models/Challenge');
const aiService = require('./aiService');
const Progress = require('../models/Progress');

const challengeService = {
  /**
   * Get all challenges with optional filters (difficulty, subject, search)
   */
  async getChallenges (filters = {}) {
    try {
      const { difficulty, subject, search } = filters;

      if (difficulty) {
        return await Challenge.findByDifficulty(difficulty);
      }

      if (subject) {
        return await Challenge.findBySubject(subject);
      }

      // Optional: basic search
      if (search) {
        const allChallenges = await Challenge.findAll();
        return allChallenges.filter(c =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()),
        );
      }

      // Default: all challenges
      return await Challenge.findAll();
    } catch (error) {
      console.error('Error getting challenges:', error.message);
      throw new Error('Failed to fetch challenges');
    }
  },

  /**
   * Generate personalized challenge recommendations for a user.
   * This could use AI or progress-based logic.
   */
  async generatePersonalizedChallenges (userId) {
    try {
      // Fetch user’s progress or learning data
      const userProgress = await Progress.findByUserId(userId);

      // If no progress, recommend easy-level challenges
      if (!userProgress.length) {
        const easyChallenges = await Challenge.findByDifficulty('easy');
        return easyChallenges.slice(0, 3);
      }

      // Use AI-based suggestions if available
      try {
        const aiSuggestions = await aiService.suggestNextChallenges(userId);
        return { source: 'ai', suggestions: aiSuggestions };
      } catch {
        console.warn('AI unavailable — using fallback recommendations');
      }

      // Fallback: recommend based on most completed difficulty
      const completed = userProgress.filter(p => p.completed);
      const avgScore = completed.reduce((a, b) => a + (b.score || 0), 0) / (completed.length || 1);

      let nextDifficulty = 'medium';
      if (avgScore > 85) nextDifficulty = 'hard';
      else if (avgScore < 60) nextDifficulty = 'easy';

      const recommendations = await Challenge.findByDifficulty(nextDifficulty);
      return recommendations.slice(0, 3);
    } catch (error) {
      console.error('Error generating personalized challenges:', error.message);
      throw new Error('Failed to generate personalized challenges');
    }
  },

  /**
   * Validate if a submitted answer or work meets challenge completion criteria.
   * This can later integrate with AI for automated evaluation.
   */
  async validateCompletion (challengeId, submissionData) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) throw new Error('Challenge not found');

      // Simple logic: text submission must contain key concepts or reach minimum length
      const { answer } = submissionData;
      const isComplete =
        answer && answer.length > 20 && /[a-zA-Z]/.test(answer);

      // You can expand with AI feedback check:
      // const feedback = await aiService.generateFeedback(answer, challenge.description);

      return {
        completed: isComplete,
        message: isComplete
          ? 'Challenge validated successfully.'
          : 'Submission incomplete or insufficient.',
        pointsEarned: isComplete ? challenge.points || 10 : 0,
      };
    } catch (error) {
      console.error('Error validating challenge completion:', error.message);
      throw new Error('Failed to validate challenge completion');
    }
  },

  /**
   * Estimate difficulty dynamically based on challenge attributes
   */
  calculateDifficulty (challenge) {
    const lengthScore = challenge.description?.length || 0;
    const points = challenge.points || 10;

    if (points > 50 || lengthScore > 800) return 'hard';
    if (points < 20 || lengthScore < 300) return 'easy';
    return 'medium';
  },
};

module.exports = challengeService;
