import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: 'student',
      description: 'Default role for learners',
    },
    {
      name: 'instructor',
      description: 'Role for course creators',
    },
    {
      name: 'admin',
      description: 'System administrator',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  console.log('Seed roles completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
