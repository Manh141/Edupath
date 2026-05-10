# EduPath Auth Service

NestJS service for EduPath authentication. The current auth flow is passwordless:

- Email sign-up and sign-in use a 6-digit verification code sent by email.
- Google and Facebook use OAuth browser redirects.
- Refresh tokens are stored as server-side sessions.
- Roles are seeded as `student`, `instructor`, and `admin`.

## Local Setup

```powershell
pnpm install
Copy-Item .env.example .env
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
pnpm start:dev
```

Update `.env` before starting the service.

## Required Environment

Core service:

```env
APP_ORIGIN=http://localhost:3001
WEB_ORIGIN=http://localhost:3006
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/edupath_auth?schema=public
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_ACCESS_SECRET=replace-with-at-least-32-characters-secret
```

Email verification codes:

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=no-reply@edupath.local
MAIL_FROM_NAME=EduPath
```

OAuth redirects:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback
```

Internal profile sync:

```env
USER_SERVICE_URL=http://localhost:3002
INTERNAL_SERVICE_SECRET=replace-with-shared-internal-secret
```

The `INTERNAL_SERVICE_SECRET` value must match the user service.

## Auth Endpoints

- `POST /auth/register-email`
- `POST /auth/register-email/verify`
- `POST /auth/login-email`
- `POST /auth/login-email/verify`
- `POST /auth/challenges/resend`
- `GET /auth/google/authorize`
- `GET /auth/google/callback`
- `GET /auth/facebook/authorize`
- `GET /auth/facebook/callback`
- `POST /auth/oauth/exchange`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Through the API Gateway, these are exposed under `/api/auth`.

## Checks

```powershell
pnpm lint:check
pnpm build
```
