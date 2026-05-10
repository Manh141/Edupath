# enrollment-service

Production-minded NestJS + Prisma scaffold for EduPath enrollment, progress, wishlist, and certificates.

## Main responsibilities

- Create/revoke/refund enrollments from internal trusted calls
- Track lecture progress and aggregate course progress
- Manage wishlist for authenticated users
- Issue certificates after completion
- Expose internal endpoints for gateway / payment / course sync

## Suggested next steps

1. Copy this service into `services/enrollment-service`
2. Adjust env values
3. Run:
   - `pnpm install`
   - `cp .env.example .env`
   - `pnpm prisma:generate`
   - `pnpm prisma:migrate --name init_enrollment_service`
   - `pnpm start:dev`
