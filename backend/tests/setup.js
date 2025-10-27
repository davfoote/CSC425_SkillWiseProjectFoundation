// Test environment setup and configuration
const path = require('path');
const dotenv = require('dotenv');
// Load test-specific env file if present (backend/.env.test) to avoid shell quoting issues on Windows
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });
const { Pool } = require('pg');

// If TEST_DATABASE_URL is provided, mirror it to DATABASE_URL early so modules that create DB pools
// (which run at require-time) use the test connection string.
if (process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

// Test database configuration
const testDbConfig = {
  connectionString: process.env.TEST_DATABASE_URL ||
    'postgresql://skillwise_user:skillwise_pass@localhost:5432/skillwise_test_db',
  // Reduce connections for test environment
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 1000,
};

const testPool = new Pool(testDbConfig);

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';

  // If a TEST_DATABASE_URL is provided, mirror it to DATABASE_URL so the app's DB connection uses it
  if (process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  }

  // Test database connection
  try {
    await testPool.query('SELECT 1');
    console.log('✅ Test database connected');
  } catch (err) {
    console.error('❌ Test database connection failed:', err.message);
    throw err;
  }
});

// Global test cleanup
afterAll(async () => {
  try {
    // Clean up test data if needed
    // await testPool.query('TRUNCATE TABLE users CASCADE');

    // Close database connections
    await testPool.end();
    console.log('✅ Test database cleanup completed');
  } catch (err) {
    console.error('❌ Test cleanup failed:', err.message);
  }
});

// Helper function to clear test data between tests
const clearTestData = async () => {
  const tables = [
    'user_achievements',
    'achievements',
    'leaderboard',
    'progress_events',
    'peer_reviews',
    'ai_feedback',
    'submissions',
    'challenges',
    'goals',
    'refresh_tokens',
    'users',
  ];

  for (const table of tables) {
    try {
      await testPool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    } catch (err) {
      // Table might not exist, continue
      console.warn(`Warning: Could not truncate table ${table}:`, err.message);
    }
  }
};

// Export test utilities
module.exports = {
  testPool,
  clearTestData,
};
