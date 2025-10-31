import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const goalService = {
  // Get all goals for authenticated user
  getGoals: async () => {
    try {
      const response = await api.get('/api/goals');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch goals');
    }
  },

  // Get single goal by ID
  getGoal: async (goalId) => {
    try {
      const response = await api.get(`/api/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch goal');
    }
  },

  // Create new goal
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/api/goals', goalData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create goal');
    }
  },

  // Update existing goal
  updateGoal: async (goalId, updateData) => {
    try {
      const response = await api.put(`/api/goals/${goalId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update goal');
    }
  },

  // Delete goal
  deleteGoal: async (goalId) => {
    try {
      await api.delete(`/api/goals/${goalId}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete goal');
    }
  },

  // Update goal progress
  updateProgress: async (goalId, progress) => {
    try {
      const response = await api.patch(`/api/goals/${goalId}/progress`, { progress_percentage: progress });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
  }
};

export default goalService;