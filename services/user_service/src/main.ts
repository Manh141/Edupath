import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { PrismaService } from './common/prisma/prisma.service';
import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  app.enableShutdownHooks();

  setupSwagger(app);

  prismaService.enableShutdownHooks(app);

  const port = configService.get<number>('PORT') ?? 3002;
  await app.listen(port);

  console.log(`user-service is running on http://localhost:${port}/api`);
  console.log(
    `swagger docs: http://localhost:${port}/${configService.get<string>('SWAGGER_PATH') ?? 'docs'}`,
  );
}

void bootstrap();
