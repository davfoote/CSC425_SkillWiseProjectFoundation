// Database service using Prisma
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Handle cleanup on exit
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
