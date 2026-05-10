type InputEnv = Record<string, unknown>;

type OutputEnv = InputEnv & {
  INTERNAL_SERVICE_SECRET?: string;
  SWAGGER_PATH?: string;
  SWAGGER_TITLE?: string;
  SWAGGER_DESCRIPTION?: string;
  SWAGGER_VERSION?: string;
};

function assertString(value: unknown, key: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  throw new Error(`Environment variable ${key} is required.`);
}

function assertMinLengthString(value: unknown, key: string, minLength: number): string {
  const normalizedValue = assertString(value, key);
  if (normalizedValue.length >= minLength) {
    return normalizedValue;
  }

  throw new Error(`Environment variable ${key} must be at least ${minLength} characters long.`);
}

function optionalString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

export function validateEnv(config: InputEnv): OutputEnv {
  return {
    NODE_ENV: optionalString(config.NODE_ENV, 'development'),
    PORT: Number(config.PORT ?? 3003),
    APP_NAME: optionalString(config.APP_NAME, 'course-service'),
    APP_VERSION: optionalString(config.APP_VERSION, '1.0.0'),
    WEB_ORIGIN: optionalString(config.WEB_ORIGIN, '*'),
    DATABASE_URL: assertString(config.DATABASE_URL, 'DATABASE_URL'),
    JWT_ACCESS_SECRET: assertMinLengthString(config.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET', 32),
    LOG_LEVEL: optionalString(config.LOG_LEVEL, 'info'),
    REDIS_URL: optionalString(config.REDIS_URL, 'redis://localhost:6379'),
    BULLMQ_ENABLED: optionalString(config.BULLMQ_ENABLED, 'false'),
    COURSE_JOBS_QUEUE: optionalString(config.COURSE_JOBS_QUEUE, 'course-jobs'),
    S3_ENDPOINT: optionalString(config.S3_ENDPOINT, ''),
    S3_REGION: optionalString(config.S3_REGION, 'us-east-1'),
    S3_ACCESS_KEY: optionalString(config.S3_ACCESS_KEY, ''),
    S3_SECRET_KEY: optionalString(config.S3_SECRET_KEY, ''),
    S3_BUCKET: optionalString(config.S3_BUCKET, ''),
    S3_FORCE_PATH_STYLE: optionalString(config.S3_FORCE_PATH_STYLE, 'true'),
    S3_PUBLIC_BASE_URL: optionalString(config.S3_PUBLIC_BASE_URL, ''),
    S3_UPLOAD_ENDPOINT: optionalString(config.S3_UPLOAD_ENDPOINT, ''),
    S3_AUTO_SETUP: optionalString(
      config.S3_AUTO_SETUP,
      optionalString(config.NODE_ENV, 'development') === 'production' ? 'false' : 'true',
    ),
    SWAGGER_PATH: optionalString(config.SWAGGER_PATH, 'docs'),
    SWAGGER_TITLE: optionalString(config.SWAGGER_TITLE, 'EduPath Course Service'),
    SWAGGER_DESCRIPTION: optionalString(
      config.SWAGGER_DESCRIPTION,
      'Course catalog, authoring, moderation, and review APIs',
    ),
    SWAGGER_VERSION: optionalString(
      config.SWAGGER_VERSION,
      optionalString(config.APP_VERSION, '1.0.0'),
    ),
    INTERNAL_SERVICE_SECRET:
      typeof config.INTERNAL_SERVICE_SECRET === 'string' &&
      config.INTERNAL_SERVICE_SECRET.trim().length > 0
        ? config.INTERNAL_SERVICE_SECRET.trim()
        : undefined,
    ENROLLMENT_SERVICE_INTERNAL_URL: optionalString(config.ENROLLMENT_SERVICE_INTERNAL_URL, ''),
    PAYMENT_SERVICE_INTERNAL_URL: optionalString(config.PAYMENT_SERVICE_INTERNAL_URL, ''),
    PAYMENT_SERVICE_TIMEOUT_MS: optionalString(config.PAYMENT_SERVICE_TIMEOUT_MS, '3000'),
    REQUIRE_INSTRUCTOR_IDENTITY: optionalString(config.REQUIRE_INSTRUCTOR_IDENTITY, 'false'),
    REQUIRE_INSTRUCTOR_MONETIZATION_FOR_PAID: optionalString(
      config.REQUIRE_INSTRUCTOR_MONETIZATION_FOR_PAID,
      'true',
    ),
  };
}
