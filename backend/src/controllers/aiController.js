// AI Controller - wire up aiService and log prompts/responses
const aiService = require('../services/aiService');
const prisma = require('../database/prisma');

const aiController = {
  // POST /api/ai/generateChallenge
  generateChallenge: async (req, res, next) => {
    try {
      const options = req.body || {};
      const userId = req.user ? req.user.id || req.user.userId : null;

      // Call AI service
      const result = await aiService.generateChallenge(options);

      // Persist log (prompt + raw response)
      try {
        await prisma.aiLog.create({
          data: {
            userId: userId ? parseInt(userId) : null,
            prompt: JSON.stringify({ options }),
            response: result.raw || JSON.stringify(result.challenge || {}),
          },
        });
      } catch (logErr) {
        // Logging should not fail the request
        console.error('Failed to persist AI log:', logErr);
      }

      // Return structured challenge to client
      return res.json({ success: true, challenge: result.challenge });
    } catch (error) {
      console.error('AI generateChallenge error:', error);
      return next(error);
    }
  },

  // Placeholder implementations for other AI routes
  // POST /api/ai/submitForFeedback
  submitForFeedback: async (req, res, next) => {
    try {
      // File may be in req.file (memoryStorage) and text may be in req.body.text
      const userId = req.user ? (req.user.id || req.user.userId) : null;
      const text = req.body && req.body.text ? req.body.text : (req.file && req.file.buffer ? req.file.buffer.toString('utf8') : '');
      const filename = req.file ? req.file.originalname : req.body.filename || null;

      if (!text) {
        return res.status(400).json({ error: 'No submission text provided' });
      }

      // Persist submission
      const submission = await prisma.submission.create({
        data: {
          userId: userId ? parseInt(userId) : null,
          filename,
          content: text,
        },
      });

      // Call AI to generate feedback
      const aiResult = await aiService.generateFeedback({ text });

      // Persist feedback
      try {
        await prisma.aiFeedback.create({
          data: {
            submissionId: submission.id,
            userId: userId ? parseInt(userId) : null,
            feedback: JSON.stringify(aiResult.feedback || {}),
            rawResponse: aiResult.raw || null,
          },
        });
      } catch (fbErr) {
        console.error('Failed to persist AI feedback:', fbErr);
      }

      // Also log prompt/response for audit
      try {
        await prisma.aiLog.create({
          data: {
            userId: userId ? parseInt(userId) : null,
            prompt: JSON.stringify({ text }),
            response: aiResult.raw || JSON.stringify(aiResult.feedback || {}),
          },
        });
      } catch (logErr) {
        console.error('Failed to persist AI log:', logErr);
      }

      return res.json({ success: true, feedback: aiResult.feedback });
    } catch (error) {
      console.error('AI submitForFeedback error:', error);
      return next(error);
    }
  },

  getHints: async (req, res, next) => {
    return res.status(501).json({ error: 'Not implemented' });
  },

  suggestChallenges: async (req, res, next) => {
    return res.status(501).json({ error: 'Not implemented' });
  },

  analyzeProgress: async (req, res, next) => {
    return res.status(501).json({ error: 'Not implemented' });
  },
};

module.exports = aiController;
