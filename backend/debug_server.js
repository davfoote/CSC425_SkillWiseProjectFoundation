#!/usr/bin/env node

try {
  console.log('Starting server...');
  const app = require('./src/app');
  console.log('App loaded successfully');
  
  const logger = app.get('logger');
  console.log('Logger obtained');
  
  const PORT = process.env.PORT || 3001;
  console.log('Port set to:', PORT);
  
  const server = app.listen(PORT, () => {
    logger.info(`🚀 SkillWise API Server running on port ${PORT}`);
    logger.info(`📊 Health check available at http://localhost:${PORT}/healthz`);
    logger.info(`🌐 API endpoints available at http://localhost:${PORT}/api`);
    logger.info(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  console.log('Server started successfully');
  
} catch (error) {
  console.error('Error starting server:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}