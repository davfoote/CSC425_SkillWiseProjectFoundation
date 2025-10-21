const { PrismaClient } = require('../src/generated/prisma');

// Test database configuration
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 
        'postgresql://skillwise_user:skillwise123@localhost:5432/skillwise_test_db'
    }
  }
});

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
  process.env.DATABASE_URL = 'postgresql://skillwise_user:skillwise123@localhost:5432/skillwise_test_db';
  
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