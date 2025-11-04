// Test database setup
const { Pool } = require('pg');

// Test database configuration
const testDbConfig = {
  connectionString: process.env.TEST_DATABASE_URL || 
    'postgresql://skillwise_user:skillwise_pass@localhost:5432/skillwise_test_db',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

let testPool;

// Mock Prisma for tests that don't need real database
const testPrisma = {
  $connect: jest.fn().mockResolvedValue(true),
  $disconnect: jest.fn().mockResolvedValue(true),
  $transaction: jest.fn().mockImplementation((callback) => callback(testPrisma)),
  user: {
    deleteMany: jest.fn().mockResolvedValue({ count: 0 })
  },
  refreshToken: {
    deleteMany: jest.fn().mockResolvedValue({ count: 0 })
  }
};

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
  process.env.DATABASE_URL = 'postgresql://skillwise_user:skillwise_pass@localhost:5432/skillwise_test_db';
  
  // Test database connection
  try {
    await testPrisma.$connect();
    console.log('✅ Test database connected');
    
    // Run migrations on test database
    const { execSync } = require('child_process');
    execSync('npx prisma migrate deploy', { 
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit'
    });
    console.log('✅ Test database migrations applied');
    
  } catch (err) {
    console.error('❌ Test database setup failed:', err.message);
    throw err;
  }
});

// Clean up database after each test
afterEach(async () => {
  try {
    // Use transaction to ensure proper cleanup order
    await testPrisma.$transaction(async (prisma) => {
      // Delete refresh tokens first (due to foreign key constraint)
      await prisma.refreshToken.deleteMany({});
      
      // Delete users
      await prisma.user.deleteMany({});
    });
    
    console.log('✅ Test database cleaned');
  } catch (error) {
    console.error('❌ Error cleaning test database:', error);
  }
});

// Global test teardown
afterAll(async () => {
  try {
    await testPrisma.$disconnect();
    console.log('✅ Test database disconnected');
  } catch (err) {
    console.error('❌ Test database disconnect failed:', err.message);
  }
});

module.exports = { testPrisma };