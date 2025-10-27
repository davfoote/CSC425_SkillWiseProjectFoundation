// src/services/aiService.js
require('dotenv').config();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiService = {
  // Generate AI feedback for a student's submission
  async generateFeedback (submissionText, challengeContext) {
    try {
      const prompt = `
You are an educational feedback assistant.
Provide clear, constructive, and encouraging feedback based on the student's submission.

Challenge context: ${challengeContext}
Student submission: ${submissionText}

Please include:
1. What the student did well.
2. Where they can improve.
3. One specific actionable tip.
`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating AI feedback:', error.message);
      throw new Error('Failed to generate feedback');
    }
  },

  // Generate hints for a given challenge based on user progress
  async generateHints (challengeDescription, userProgress = {}) {
    try {
      const prompt = `
You are a helpful tutoring assistant.
The user is attempting this challenge:

${challengeDescription}

Their current progress or difficulty: ${JSON.stringify(userProgress)}

Give them up to 3 helpful hints without revealing the full answer.
`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.8,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating hints:', error.message);
      throw new Error('Failed to generate hints');
    }
  },

  // Analyze user's learning data to identify strengths and weaknesses
  async analyzePattern (userId, learningData = []) {
    try {
      const prompt = `
Analyze the following user's learning data and summarize their performance.

User ID: ${userId}
Learning data: ${JSON.stringify(learningData)}

Provide:
- Key strengths
- Areas for improvement
- Recommended study focus
`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.6,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error analyzing learning pattern:', error.message);
      throw new Error('Failed to analyze learning pattern');
    }
  },

  // Suggest personalized next challenges
  async suggestNextChallenges (userId) {
    try {
      const prompt = `
You are a learning recommender system.
Based on the user's past performance and preferences, suggest 3 upcoming challenges.

User ID: ${userId}
Please include a short title, difficulty level, and reason for suggestion.
`;

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.75,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error suggesting next challenges:', error.message);
      throw new Error('Failed to suggest challenges');
    }
  },
};

module.exports = aiService;
