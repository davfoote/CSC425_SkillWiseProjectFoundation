/**
 * Progress Service
 * 
 * Handles calculation of user progress based on goals and challenges
 * Provides real-time progress tracking functionality
 */

import goalService from '../services/goalService';
import challengeService from '../services/challengeService';

export const progressService = {
  
  /**
   * Calculate overall user progress based on goals and challenges
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Progress data object
   */
  calculateOverallProgress: async (userId) => {
    try {
      // Get user's goals and challenges
      const [goals, challenges] = await Promise.all([
        goalService.getGoals(),
        challengeService.getChallenges()
      ]);

      // Filter user's data (if needed, depending on API response)
      const userGoals = goals.data || goals;
      const userChallenges = challenges.data || challenges;

      // Calculate goal-based progress
      const goalProgress = calculateGoalProgress(userGoals);
      
      // Calculate challenge-based progress
      const challengeProgress = calculateChallengeProgress(userChallenges);
      
      // Calculate combined progress
      const overallProgress = calculateCombinedProgress(goalProgress, challengeProgress);

      return {
        overall: overallProgress,
        goals: goalProgress,
        challenges: challengeProgress,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error calculating progress:', error);
      return {
        overall: { percentage: 0, completed: 0, total: 0 },
        goals: { percentage: 0, completed: 0, total: 0 },
        challenges: { percentage: 0, completed: 0, total: 0 },
        error: error.message
      };
    }
  },

  /**
   * Get progress for a specific goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Goal progress data
   */
  getGoalProgress: async (goalId) => {
    try {
      const goal = await goalService.getGoal(goalId);
      const goalChallenges = await challengeService.getChallengesByGoal(goalId);
      
      const challengeProgress = calculateChallengeProgress(goalChallenges.data || goalChallenges);
      
      return {
        goalId: goalId,
        goalTitle: goal.title,
        goalProgress: goal.progress_percentage || 0,
        challengeProgress: challengeProgress,
        isCompleted: goal.is_completed || false,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error getting goal progress:', error);
      return {
        goalId: goalId,
        goalProgress: 0,
        challengeProgress: { percentage: 0, completed: 0, total: 0 },
        error: error.message
      };
    }
  },

  /**
   * Update progress when a challenge is completed
   * @param {string} challengeId - Challenge ID
   * @param {boolean} isCompleted - Completion status
   * @returns {Promise<Object>} Updated progress data
   */
  updateChallengeCompletion: async (challengeId, isCompleted = true) => {
    try {
      // In a real implementation, this would call an API to mark challenge as complete
      // For now, we'll simulate the update and recalculate progress
      
      console.log(`Challenge ${challengeId} marked as ${isCompleted ? 'completed' : 'incomplete'}`);
      
      // Trigger progress recalculation
      const updatedProgress = await progressService.calculateOverallProgress();
      
      return updatedProgress;
      
    } catch (error) {
      console.error('Error updating challenge completion:', error);
      throw error;
    }
  }
};

/**
 * Calculate progress based on goals
 * @param {Array} goals - Array of goal objects
 * @returns {Object} Goal progress data
 */
function calculateGoalProgress(goals) {
  if (!goals || goals.length === 0) {
    return { percentage: 0, completed: 0, total: 0 };
  }

  const total = goals.length;
  const completed = goals.filter(goal => goal.is_completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate average progress percentage for all goals
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress_percentage || 0), 0);
  const averageProgress = total > 0 ? Math.round(totalProgress / total) : 0;

  return {
    percentage: Math.max(percentage, averageProgress), // Use higher of completion rate or average progress
    completed,
    total,
    averageProgress,
    completionRate: percentage
  };
}

/**
 * Calculate progress based on challenges
 * @param {Array} challenges - Array of challenge objects
 * @returns {Object} Challenge progress data
 */
function calculateChallengeProgress(challenges) {
  if (!challenges || challenges.length === 0) {
    return { percentage: 0, completed: 0, total: 0 };
  }

  const total = challenges.length;
  // For now, we'll simulate completion status since we don't have submission tracking yet
  // In a real implementation, this would check actual user submissions/completions
  const completed = Math.floor(total * 0.3); // Simulate 30% completion for demo
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    percentage,
    completed,
    total
  };
}

/**
 * Calculate combined progress from goals and challenges
 * @param {Object} goalProgress - Goal progress data
 * @param {Object} challengeProgress - Challenge progress data
 * @returns {Object} Combined progress data
 */
function calculateCombinedProgress(goalProgress, challengeProgress) {
  // Weighted combination: 60% goals, 40% challenges
  const goalWeight = 0.6;
  const challengeWeight = 0.4;

  const combinedPercentage = Math.round(
    (goalProgress.percentage * goalWeight) + (challengeProgress.percentage * challengeWeight)
  );

  const totalItems = goalProgress.total + challengeProgress.total;
  const completedItems = goalProgress.completed + challengeProgress.completed;

  return {
    percentage: combinedPercentage,
    completed: completedItems,
    total: totalItems,
    breakdown: {
      goals: goalProgress,
      challenges: challengeProgress
    }
  };
}

export default progressService;