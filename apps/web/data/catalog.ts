export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface CatalogLesson {
  id: string;
  title: string;
  durationMinutes?: number;
  isFree?: boolean;
}

export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  durationHours: number;
  studentsCount: number;
  averageRating: number;
  categorySlug: string;
  categoryName: string;
  instructorName: string;
  lessons: CatalogLesson[];
}

export const categories: CatalogCategory[] = [
  {
    id: "cat-frontend",
    slug: "frontend",
    name: "Frontend",
    description: "HTML, CSS, React, Next.js, and modern UI development.",
    icon: "💻",
  },
  {
    id: "cat-backend",
    slug: "backend",
    name: "Backend",
    description: "NestJS, Node.js, API Gateway, and service architecture.",
    icon: "🛠️",
  },
  {
    id: "cat-devops",
    slug: "devops",
    name: "DevOps",
    description: "Docker, CI/CD, logging, and practical deployment basics.",
    icon: "🚀",
  },
  {
    id: "cat-data",
    slug: "data",
    name: "Data",
    description: "SQL, Prisma, reporting, and data visualization.",
    icon: "📊",
  },
  {
    id: "cat-design",
    slug: "design",
    name: "Design",
    description: "UI/UX design for digital products.",
    icon: "🎨",
  },
  {
    id: "cat-mobile",
    slug: "mobile",
    name: "Mobile",
    description: "Building mobile apps and improving user experience.",
    icon: "📱",
  },
];

export const courses: CatalogCourse[] = [
  {
    id: "course-react-ui",
    slug: "react-ui-foundations",
    title: "React UI Foundations",
    description:
      "Build the foundation of an online learning interface with React, Tailwind CSS, and component architecture. This demo dataset keeps the UI available while you progressively connect it to the course service.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    price: 0,
    level: "beginner",
    durationHours: 12,
    studentsCount: 1240,
    averageRating: 4.8,
    categorySlug: "frontend",
    categoryName: "Frontend",
    instructorName: "EduPath Studio",
    lessons: [
      {
        id: "l1",
        title: "Building the UI with reusable components",
        durationMinutes: 18,
        isFree: true,
      },
      {
        id: "l2",
        title: "Designing the landing page layout",
        durationMinutes: 24,
        isFree: true,
      },
      {
        id: "l3",
        title: "Managing state for auth forms",
        durationMinutes: 32,
      },
    ],
  },
  {
    id: "course-nest-auth",
    slug: "nest-auth-practical",
    title: "NestJS Auth Practical",
    description:
      "Move from controllers and services to JWT bearer auth, refresh tokens, guards, and role checks. This demo course matches the current auth service architecture well.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    price: 399000,
    level: "intermediate",
    durationHours: 16,
    studentsCount: 860,
    averageRating: 4.9,
    categorySlug: "backend",
    categoryName: "Backend",
    instructorName: "EduPath Studio",
    lessons: [
      {
        id: "l4",
        title: "JWT access token flow",
        durationMinutes: 21,
        isFree: true,
      },
      { id: "l5", title: "Refresh token rotation", durationMinutes: 27 },
      { id: "l6", title: "RBAC and role guards", durationMinutes: 29 },
    ],
  },
  {
    id: "course-docker-dev",
    slug: "docker-dev-workflow",
    title: "Docker Dev Workflow",
    description:
      "Standardize the local monorepo environment with Docker Compose, Redis, Postgres, and a service gateway.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    price: 299000,
    level: "intermediate",
    durationHours: 10,
    studentsCount: 540,
    averageRating: 4.7,
    categorySlug: "devops",
    categoryName: "DevOps",
    instructorName: "EduPath Studio",
    lessons: [
      {
        id: "l7",
        title: "Service orchestration",
        durationMinutes: 20,
        isFree: true,
      },
      { id: "l8", title: "Volumes and networking", durationMinutes: 25 },
      { id: "l9", title: "Debugging container logs", durationMinutes: 19 },
    ],
  },
  {
    id: "course-prisma-postgres",
    slug: "prisma-postgres-core",
    title: "Prisma + PostgreSQL Core",
    description:
      "Design schemas, migrations, and stable read models to keep auth service and other services in sync.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    price: 499000,
    level: "advanced",
    durationHours: 14,
    studentsCount: 410,
    averageRating: 4.9,
    categorySlug: "data",
    categoryName: "Data",
    instructorName: "EduPath Studio",
    lessons: [
      {
        id: "l10",
        title: "Schema modeling",
        durationMinutes: 22,
        isFree: true,
      },
      { id: "l11", title: "Migration strategy", durationMinutes: 31 },
      { id: "l12", title: "Production debugging", durationMinutes: 33 },
    ],
  },
];

export function getCourseBySlug(slug?: string) {
  return courses.find((course) => course.slug === slug);
}
