import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  APP_NAME: Joi.string().default('auth-service'),
  APP_ORIGIN: Joi.string().uri().required(),
  WEB_ORIGIN: Joi.string().uri().required(),

  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_ACCESS_ISSUER: Joi.string().allow('').optional(),
  JWT_ACCESS_AUDIENCE: Joi.string().allow('').optional(),

  REFRESH_TOKEN_EXPIRES_IN_DAYS: Joi.number().integer().positive().default(7),
  AUTH_CHALLENGE_EXPIRES_IN_MINUTES: Joi.number()
    .integer()
    .positive()
    .default(10),
  AUTH_CHALLENGE_MAX_ATTEMPTS: Joi.number().integer().positive().default(5),
  AUTH_CHALLENGE_MAX_RESENDS: Joi.number().integer().min(0).default(3),
  OAUTH_STATE_EXPIRES_IN_MINUTES: Joi.number().integer().positive().default(10),
  OAUTH_EXCHANGE_CODE_EXPIRES_IN_MINUTES: Joi.number()
    .integer()
    .positive()
    .default(5),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().port().default(587),
  SMTP_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  MAIL_FROM: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  MAIL_FROM_NAME: Joi.string().allow('').optional(),

  THROTTLE_TTL: Joi.number().integer().positive().default(60),
  THROTTLE_LIMIT: Joi.number().integer().positive().default(10),

  MAIL_QUEUE_NAME: Joi.string().default('mail_queue'),

  USER_SERVICE_URL: Joi.string().uri().allow('').optional(),
  INTERNAL_SERVICE_SECRET: Joi.string().min(16).allow('').optional(),
  ADMIN_ACCOUNTS_JSON: Joi.string().allow('').optional(),
  EXPOSE_OTP_IN_RESPONSE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),

  GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),
  GOOGLE_CALLBACK_URL: Joi.string().allow('').optional(),
  FACEBOOK_CLIENT_ID: Joi.string().allow('').optional(),
  FACEBOOK_CLIENT_SECRET: Joi.string().allow('').optional(),
  FACEBOOK_CALLBACK_URL: Joi.string().allow('').optional(),
});
