# course-service

Production-oriented scaffold for EduPath `course-service`, built with:

- NestJS
- PostgreSQL + Prisma
- JWT guards
- Swagger/OpenAPI
- Pino logging
- Redis + BullMQ (lazy/no-op until enabled)
- S3-compatible object storage (MinIO-ready)

## What is included

- Optimized Prisma schema for course catalog + content tree
- Public / instructor / admin / internal controllers
- DTO validation with `class-validator`
- Unified response interceptor
- Prisma-aware exception filter
- Health and readiness endpoints
- Lazy Redis and BullMQ integration to reduce local startup friction
- MinIO/S3 storage service for course assets

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm prisma generate
pnpm prisma migrate dev --name init_course_service
pnpm db:seed
pnpm start:dev
```

## Suggested startup order in your monorepo

1. postgres-course
2. redis
3. minio
4. course-service
5. api-gateway
6. web

## Main route groups

- `GET /api/health`
- `GET /api/ready`
- `GET /api/categories`
- `GET /api/courses`
- `GET /api/courses/:slug`
- `POST /api/instructor/courses`
- `POST /api/instructor/courses/:id/submit-review`
- `POST /api/admin/courses/:id/approve`
- `POST /api/admin/courses/:id/publish`
- `GET /api/internal/courses/:id/basic`

## Notes

- `Course.status` is the source of truth; no duplicate `isPublished` flag on the course.
- `isFree` is intentionally removed; infer from `price <= 0`.
- `LectureType.quiz` is excluded from v1 to avoid half-baked domain logic.
- `deletedAt` is added for safe soft deletes.
