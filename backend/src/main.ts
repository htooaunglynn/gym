import 'dotenv/config';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/index.js';
import { ResponseTransformInterceptor } from './common/interceptors/index.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(app.get(Logger));

    // ── Security ──────────────────────────────────────────────────────
    app.use(helmet());
    app.use(compression());

    app.enableCors({
        origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
        maxAge: 86400,
    });

    // ── Global prefix & versioning ───────────────────────────────────
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // ── Global pipes, filters & interceptors ─────────────────────────
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
    app.useGlobalInterceptors(new ResponseTransformInterceptor());

    // ── Swagger (non-production only) ────────────────────────────────
    if (process.env.NODE_ENV !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('Gym API')
            .setDescription('Gym backend API documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .addApiKey(
                { type: 'apiKey', name: 'x-api-key', in: 'header' },
                'api-key',
            )
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('docs', app, document);
    }

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
}
bootstrap();
