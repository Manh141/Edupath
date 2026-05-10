import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';
import { setupSwagger } from './common/swagger/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { JwtAccessGuard } from './common/guards/jwt-access.guard';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());

  app.enableCors({
    origin: [process.env.WEB_ORIGIN ?? 'http://localhost:3000'],
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

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAccessGuard(reflector), new RolesGuard(reflector));

  setupSwagger(app);

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  console.log(`auth-service is running on http://localhost:${port}/api`);
  console.log(`swagger docs: http://localhost:${port}/docs`);
}

void bootstrap();
