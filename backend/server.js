/**
 * Server entrypoint for development and production.
 *
 * This file starts the Express app exported from `src/app.js`.
 * The previous file contained test helpers which caused the app to crash
 * when run under nodemon inside Docker (because Jest globals like beforeAll
 * are not defined). We replace it with a proper server start sequence.
 */

require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  app.get('logger') && app.get('logger').info({ port: PORT }, `Server listening on port ${PORT}`);
  console.log(`SkillWise API listening on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;
