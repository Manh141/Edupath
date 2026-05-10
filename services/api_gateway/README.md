# EduPath API Gateway

Production-oriented NestJS API gateway for the EduPath microservices platform.

## Included capabilities

- JWT access-token verification at the gateway edge
- Forwarded internal auth headers (`x-auth-user-id`, `x-auth-user-email`, `x-auth-user-role`)
- Thin reverse proxy via `http-proxy-middleware`
- Request ID propagation
- Structured logging with `nestjs-pino`
- Security headers via `helmet`
- CORS policy for the web app origin
- Swagger/OpenAPI endpoint
- Health and readiness endpoints
- Throttling / rate limiting
- Environment validation with `zod`

## Routes

- `GET /health`
- `GET /ready`
- `GET /gateway/me` (requires a valid access token)
- `GET /gateway/routes` (requires a valid access token with `admin` role)
- Proxy entrypoints:
  - `/api/auth/*`
  - `/api/users/*`
  - `/api/courses/*`
  - `/api/enrollments/*`
  - `/api/payments/*`

## Notes on authentication

This gateway performs **soft edge verification**:

- if no `Authorization` header is present, the request is proxied unchanged
- if an `Authorization: Bearer <token>` header is present, the gateway verifies it
- when valid, it forwards internal headers to downstream services
- when invalid, it returns `401 Unauthorized`

This keeps public endpoints accessible while still rejecting malformed or expired tokens early.
