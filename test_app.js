require('dotenv').config();
console.log('Loading Express app...');
try {
  const app = require('./backend/src/app');
  console.log('Express app loaded successfully');
  console.log('App has logger:', !!app.get('logger'));
} catch (err) {
  console.error('Failed to load Express app:', err.message);
  console.error('Stack:', err.stack);
}