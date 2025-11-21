import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

const aiService = {
  // Submit text and/or file to backend AI feedback endpoint
  submitForFeedback: async ({ text, file, challengeId } = {}) => {
    try {
      // If a file is provided, use multipart/form-data
      if (file) {
        const form = new FormData();
        form.append('file', file);
        if (text) form.append('text', text);
        if (challengeId) form.append('challengeId', challengeId);

        const response = await apiClient.post('/ai/submitForFeedback', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      }

      // Otherwise send JSON
      const payload = { text };
      if (challengeId) payload.challengeId = challengeId;
      const response = await apiClient.post('/ai/submitForFeedback', payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting for AI feedback:', error);
      throw error;
    }
  },
};

export default aiService;
