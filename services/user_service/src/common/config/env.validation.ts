import * as Joi from 'joi';

type AppEnv = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  APP_NAME: string;
  CORS_ORIGIN: string;
  SWAGGER_PATH: string;
  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_VERSION: string;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  INTERNAL_SERVICE_SECRET?: string;
  AUTH_SERVICE_URL?: string;
  EXTERNAL_SERVICE_TIMEOUT_MS: number;
};

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const schema = Joi.object<AppEnv>({
    NODE_ENV: Joi.string()
      .valid('development', 'test', 'production')
      .default('development'),
    PORT: Joi.number().default(3002),
    APP_NAME: Joi.string().default('user-service'),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
    SWAGGER_PATH: Joi.string().default('docs'),
    SWAGGER_TITLE: Joi.string().default('EduPath User Service'),
    SWAGGER_DESCRIPTION: Joi.string().default(
      'User profile, instructor profile, and preferences APIs',
    ),
    SWAGGER_VERSION: Joi.string().default('1.0.0'),
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    INTERNAL_SERVICE_SECRET: Joi.string().min(16).optional(),
    AUTH_SERVICE_URL: Joi.string().uri().allow('').optional(),
    EXTERNAL_SERVICE_TIMEOUT_MS: Joi.number().integer().positive().default(5000),
  });

  const validationResult: Joi.ValidationResult<AppEnv> = schema.validate(
    config,
    {
      allowUnknown: true,
      abortEarly: false,
    },
  );

  if (validationResult.error) {
    throw new Error(
      `Environment validation error: ${validationResult.error.message}`,
    );
  }

  return validationResult.value;
}
