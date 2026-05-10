type InputEnv = Record<string, unknown>;

type OutputEnv = InputEnv;

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
    PORT: Number(config.PORT ?? 3007),
    APP_NAME: optionalString(config.APP_NAME, 'communication-service'),
    APP_VERSION: optionalString(config.APP_VERSION, '1.0.0'),
    WEB_ORIGIN: optionalString(config.WEB_ORIGIN, '*'),
    DATABASE_URL: assertString(config.DATABASE_URL, 'DATABASE_URL'),
    JWT_ACCESS_SECRET: assertMinLengthString(config.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET', 32),
    LOG_LEVEL: optionalString(config.LOG_LEVEL, 'info'),
    REDIS_URL: optionalString(config.REDIS_URL, 'redis://localhost:6379'),
    SWAGGER_PATH: optionalString(config.SWAGGER_PATH, 'docs'),
    SWAGGER_TITLE: optionalString(config.SWAGGER_TITLE, 'EduPath Communication Service'),
    SWAGGER_DESCRIPTION: optionalString(
      config.SWAGGER_DESCRIPTION,
      'Chat, discussions/Q&A, course reviews and instructor performance APIs',
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
    COURSE_SERVICE_INTERNAL_URL: optionalString(config.COURSE_SERVICE_INTERNAL_URL, ''),
    ENROLLMENT_SERVICE_INTERNAL_URL: optionalString(config.ENROLLMENT_SERVICE_INTERNAL_URL, ''),
    USER_SERVICE_INTERNAL_URL: optionalString(config.USER_SERVICE_INTERNAL_URL, ''),
    EXTERNAL_SERVICE_TIMEOUT_MS: optionalString(config.EXTERNAL_SERVICE_TIMEOUT_MS, '5000'),
    REVIEW_REQUIRE_ENROLLMENT: optionalString(config.REVIEW_REQUIRE_ENROLLMENT, 'true'),
    SOCKET_PATH: optionalString(config.SOCKET_PATH, '/socket.io'),
  };
}
