import { z } from 'zod';

const booleanFromString = z.union([z.boolean(), z.string()]).transform((value) => {
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
});

const numberFromString = z.union([z.number(), z.string()]).transform((value, ctx) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Expected a valid number' });
    return z.NEVER;
  }
  return parsed;
});

const optionalUrl = z.string().url().optional();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().min(1).default('api-gateway'),
  PORT: numberFromString.default(3000),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  SWAGGER_ENABLED: booleanFromString.default(true),
  SWAGGER_PATH: z.string().min(1).default('docs'),
  PROXY_TIMEOUT_MS: numberFromString.default(10000),
  AUTH_HEADER_FORWARDING: booleanFromString.default(true),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_AUDIENCE: z.string().min(1).optional(),
  JWT_ACCESS_ISSUER: z.string().min(1).optional(),
  THROTTLE_TTL_MS: numberFromString.default(60000),
  THROTTLE_LIMIT: numberFromString.default(120),
  READINESS_TIMEOUT_MS: numberFromString.default(2000),
  AUTH_SERVICE_URL: z.string().url(),
  USER_SERVICE_URL: optionalUrl,
  COURSE_SERVICE_URL: optionalUrl,
  ENROLLMENT_SERVICE_URL: optionalUrl,
  PAYMENT_SERVICE_URL: optionalUrl,
  COMMUNICATION_SERVICE_URL: optionalUrl,
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): AppEnv {
  return envSchema.parse(config);
}
