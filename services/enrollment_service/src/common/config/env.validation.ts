import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3004),
  APP_NAME: Joi.string().default('enrollment-service'),
  APP_VERSION: Joi.string().default('1.0.0'),
  LOG_LEVEL: Joi.string().default('info'),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  COURSE_SERVICE_URL: Joi.string().uri().required(),
  CORS_ORIGIN: Joi.string().optional(),
  INTERNAL_SERVICE_SECRET: Joi.string().min(16).optional(),
  SWAGGER_PATH: Joi.string().default('docs'),
  SWAGGER_TITLE: Joi.string().default('EduPath Enrollment Service'),
  SWAGGER_DESCRIPTION: Joi.string().default('Enrollment, progress, wishlist, and certificate APIs'),
  SWAGGER_VERSION: Joi.string().default(Joi.ref('APP_VERSION')),
});
