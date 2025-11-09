const prisma = require('../src/database/prisma');

async function seed() {
  try {
    const email = process.env.TEST_USER_EMAIL || 'e2e_test@example.com';
    const passwordHash = process.env.TEST_PASSWORD_HASH || 'testhash';

    console.log('Seeding test data using DATABASE_URL:', process.env.DATABASE_URL || 'default');

    // Upsert test user (idempotent)
    const user = await prisma.user.upsert({
      where: { email },
      update: { firstName: 'E2E', lastName: 'Tester' },
      create: {
        email,
        firstName: 'E2E',
        lastName: 'Tester',
        password_hash: passwordHash
      }
    });

    console.log('User upserted:', { id: user.id, email: user.email });

    // Create a sample goal for this user if not existing
    const existingGoal = await prisma.goal.findFirst({ where: { userId: user.id, title: 'E2E Sample Goal' } });
    let goal;
    if (!existingGoal) {
      goal = await prisma.goal.create({ data: {
        userId: user.id,
        title: 'E2E Sample Goal',
        description: 'Seeded goal for end-to-end tests',
        difficultyLevel: 'easy',
        targetCompletionDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
        progressPercentage: 0
      }});
      console.log('Created goal:', goal.id);
    } else {
      goal = existingGoal;
      console.log('Existing goal found:', goal.id);
    }

    // Create a sample challenge if not existing
    const existingChallenge = await prisma.challenge.findFirst({ where: { title: 'E2E Sample Challenge' } });
    let challenge;
    if (!existingChallenge) {
      challenge = await prisma.challenge.create({ data: {
        title: 'E2E Sample Challenge',
        description: 'Seeded challenge for end-to-end tests',
        difficultyLevel: 'easy',
        category: 'e2e',
        pointsReward: 10,
        isActive: true
      }});
      console.log('Created challenge:', challenge.id);
    } else {
      challenge = existingChallenge;
      console.log('Existing challenge found:', challenge.id);
    }

    console.log('Seed complete. User id:', user.id, 'Goal id:', goal.id, 'Challenge id:', challenge.id);

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
