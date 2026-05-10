import { PrismaClient } from '../src/generated/prisma';
import { slugify } from '../src/common/utils/slug.util';

const prisma = new PrismaClient();

async function main() {
  const development = await prisma.category.upsert({
    where: { slug: 'development' },
    update: {},
    create: {
      name: 'Development',
      slug: 'development',
      description: 'Programming and software engineering courses.',
      subcategories: {
        create: [
          {
            name: 'Web Development',
            slug: 'web-development',
            description: 'Frontend and backend web development courses.',
          },
          {
            name: 'Node.js',
            slug: 'nodejs',
            description: 'Node.js and server-side TypeScript courses.',
          },
        ],
      },
    },
    include: {
      subcategories: true,
    },
  });

  const subcategory = development.subcategories[0];
  if (!subcategory) return;

  const existing = await prisma.course.findFirst({
    where: { slug: 'nestjs-course-service-architecture' },
  });

  if (existing) return;

  await prisma.course.create({
    data: {
      title: 'NestJS Course Service Architecture',
      slug: slugify('NestJS Course Service Architecture'),
      subtitle: 'Build a production-ready course service with NestJS and Prisma',
      description: 'A starter seed course to verify the scaffold and public catalog flow.',
      subcategoryId: subcategory.id,
      thumbnailUrl: 'https://example.com/thumbnail.png',
      language: 'en',
      level: 'Intermediate',
      status: 'published',
      publishedAt: new Date(),
      price: 0,
      currency: 'USD',
      instructors: {
        create: [
          {
            instructorId: 'seed-instructor-1',
            displayName: 'Seed Instructor',
            avatarUrl: '',
            bio: 'Seed data for local development',
            isPrimary: true,
          },
        ],
      },
      sections: {
        create: [
          {
            title: 'Introduction',
            order: 1,
            lectures: {
              create: [
                {
                  title: 'Welcome',
                  slug: 'welcome',
                  type: 'video',
                  videoUrl: 'https://example.com/welcome.mp4',
                  durationSec: 300,
                  isPreview: true,
                  isPublished: true,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
      objectives: {
        create: [
          { content: 'Understand clean service boundaries', order: 1 },
          { content: 'Use Prisma transactions correctly', order: 2 },
        ],
      },
      requirements: {
        create: [
          { content: 'Basic NestJS knowledge', order: 1 },
        ],
      },
      targetAudiences: {
        create: [
          { content: 'Backend engineers building LMS platforms', order: 1 },
        ],
      },
      faqs: {
        create: [
          {
            question: 'Is this course free?',
            answer: 'Yes, the seed course is free.',
            order: 1,
          },
        ],
      },
      message: {
        create: {
          welcomeMessage: 'Welcome to the seed course!',
          congratulationsMessage: 'Great job finishing the seed course!',
        },
      },
      totalDurationSec: 300,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
