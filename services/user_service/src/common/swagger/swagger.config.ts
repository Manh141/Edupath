import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE ?? 'EduPath User Service')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION ??
        'User profile, instructor profile, and preferences APIs',
    )
    .setVersion(process.env.SWAGGER_VERSION ?? '1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(process.env.SWAGGER_PATH ?? 'docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
