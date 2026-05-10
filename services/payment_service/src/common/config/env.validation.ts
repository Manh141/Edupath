import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3005),
  APP_NAME: Joi.string().default('payment-service'),
  API_PREFIX: Joi.string().default('api'),
  WEB_ORIGIN: Joi.string().required(),
  APP_ORIGIN: Joi.string().required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required(),
  COURSE_SERVICE_URL: Joi.string().uri().required(),
  ENROLLMENT_SERVICE_URL: Joi.string().uri().required(),
  INTERNAL_SERVICE_SECRET: Joi.string().min(16).optional(),
  SWAGGER_PATH: Joi.string().default('docs'),
  SWAGGER_TITLE: Joi.string().default('Payment Service'),
  SWAGGER_DESCRIPTION: Joi.string().default('EduPath payment service'),
  SWAGGER_VERSION: Joi.string().default('1.0.0'),
  BULLMQ_PREFIX: Joi.string().default('edupath'),
  PAYMENT_QUEUE_NAME: Joi.string().default('payment-events'),
  DEFAULT_CURRENCY: Joi.string().default('VND'),
  ORDER_TTL_MINUTES: Joi.number().integer().min(1).default(30),
  PAYMENT_CALLBACK_BASE_URL: Joi.string().uri().required(),
  PAYMENT_CALLBACK_SECRET: Joi.string().min(32).required(),
  PAYMENT_PII_KEY_BASE64: Joi.string().base64().optional(),
  PAYMENT_SANDBOX_MODE: Joi.string()
    .valid('true', 'false', '1', '0', 'yes', 'no', 'on', 'off')
    .optional(),
});
