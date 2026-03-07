import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const corsOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // ── Security ──────────────────────────────────────────────────────
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    maxAge: 86400,
  });

  // ── Global prefix & versioning ───────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ── Global pipes ─────────────────────────────────────────────────
  // (Filters & interceptors are registered via DI in AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger (non-production only) ────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Gym API')
      .setDescription('Gym backend API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    const logger = app.get(Logger);
    logger.log(`Server is running on http://localhost:${port}/api/v1`);
    logger.log(`Swagger docs available at http://localhost:${port}/docs`);
  });
}
void bootstrap();
