FROM node:22-alpine AS base
ARG PNPM_VERSION=10.32.1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && for attempt in 1 2 3; do corepack prepare "pnpm@${PNPM_VERSION}" --activate && break; if [ "$attempt" = "3" ]; then exit 1; fi; sleep 5; done
WORKDIR /app

FROM base AS deps
COPY package.json ./
RUN for attempt in 1 2 3; do pnpm install --no-frozen-lockfile && break; if [ "$attempt" = "3" ]; then exit 1; fi; sleep 5; done

FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3001
CMD ["sh", "-c", "if [ -f prisma/schema.prisma ]; then pnpm prisma generate && pnpm prisma migrate deploy; if [ \"$SEED_DATABASE\" = \"true\" ]; then pnpm prisma:seed; fi; fi && pnpm start:dev"]

FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN if [ -f prisma/schema.prisma ]; then pnpm prisma generate; fi && pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3001
CMD ["sh", "-c", "if [ -f prisma/schema.prisma ]; then pnpm prisma migrate deploy; if [ \"$SEED_DATABASE\" = \"true\" ]; then pnpm prisma:seed; fi; fi && pnpm start:prod"]
