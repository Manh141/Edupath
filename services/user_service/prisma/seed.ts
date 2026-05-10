import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

function main(): void {
  console.log('User service seed: nothing required yet.');
}

void Promise.resolve()
  .then(main)
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
