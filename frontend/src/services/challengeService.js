import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const challengeService = {
  // Get all challenges with optional filters
  getChallenges: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters as query parameters
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.requiresPeerReview !== undefined) params.append('requiresPeerReview', filters.requiresPeerReview);
      
      const queryString = params.toString();
      const url = `/challenges${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      // Handle backend response format: { success: true, count: X, data: [...] }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch challenges');
    }
  },

  // Get challenge by ID
  getChallengeById: async (challengeId) => {
    try {
      const response = await apiClient.get(`/challenges/${challengeId}`);
      // Handle backend response format: { success: true, data: {...} }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch challenge');
    }
  },

  // Create new challenge (admin only - for future use)
  createChallenge: async (challengeData) => {
    try {
      const response = await apiClient.post('/challenges', challengeData);
      return response.data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to create challenge');
    }
  },

  // Update challenge (admin only - for future use)
  updateChallenge: async (challengeId, updateData) => {
    try {
      const response = await apiClient.put(`/challenges/${challengeId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to update challenge');
    }
  },

  // Delete challenge (admin only - for future use)
  deleteChallenge: async (challengeId) => {
    try {
      const response = await apiClient.delete(`/challenges/${challengeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete challenge');
    }
  },

  // Get challenges by category
  getChallengesByCategory: async (category) => {
    try {
      return await challengeService.getChallenges({ category });
    } catch (error) {
      console.error('Error fetching challenges by category:', error);
      throw error;
    }
  },

  // Get challenges by difficulty
  getChallengesByDifficulty: async (difficulty) => {
    try {
      return await challengeService.getChallenges({ difficulty });
    } catch (error) {
      console.error('Error fetching challenges by difficulty:', error);
      throw error;
    }
  },

  // Get available challenges (active only)
  getAvailableChallenges: async () => {
    try {
      return await challengeService.getChallenges({ isActive: true });
    } catch (error) {
      console.error('Error fetching available challenges:', error);
      throw error;
    }
  },

  // Mark challenge as completed
  markChallengeComplete: async (challengeId) => {
    try {
      // TODO: Implement actual completion endpoint when backend is ready
      // For now, simulate the API call
      console.log(`Marking challenge ${challengeId} as complete`);
      
      // Simulate API response
      return {
        success: true,
        message: 'Challenge marked as complete',
        challengeId: challengeId,
        completedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error marking challenge complete:', error);
      throw error;
    }
  },

  // Get challenges for a specific goal
  getChallengesByGoal: async (goalId) => {
    try {
      const response = await apiClient.get(`/challenges/goal/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching challenges by goal:', error);
      throw error;
    }
  },

  // Get user's completed challenges
  getCompletedChallenges: async () => {
    try {
      // TODO: Implement when completion tracking is available in backend
      // For now, simulate some completed challenges
      const allChallenges = await challengeService.getChallenges();
      const challenges = allChallenges.data || allChallenges;
      
      // Simulate 30% completion rate
      const completedCount = Math.floor(challenges.length * 0.3);
      const completed = challenges.slice(0, completedCount).map(challenge => ({
        ...challenge,
        completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      return { data: completed };
    } catch (error) {
      console.error('Error fetching completed challenges:', error);
      throw error;
    }
  }
};

export default challengeService;