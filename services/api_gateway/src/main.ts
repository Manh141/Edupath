import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './common/config/env.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const envService = app.get(EnvService);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableCors({
    origin: envService.webOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Internal-Service-Secret',
      'X-Internal-Service-Name',
    ],
    exposedHeaders: ['X-Request-Id'],
  });
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  if (envService.swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('EduPath API Gateway')
      .setDescription('Gateway edge API for the EduPath microservices')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(envService.swaggerPath, app, document, {
      useGlobalPrefix: false,
    });
  }

  await app.listen(envService.port, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`API Gateway is running on http://0.0.0.0:${envService.port}`);
  logger.log(`Swagger: http://0.0.0.0:${envService.port}/${envService.swaggerPath}`);
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap api-gateway', error);
  process.exit(1);
});
