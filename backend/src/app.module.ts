import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller.js';
import { LoggerModule } from './logger/logger.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { JwtAuthGuard, RolesGuard } from './auth/guards/index.js';
import { ApiKeyGuard } from './common/guards/index.js';
import { GlobalExceptionFilter } from './common/filters/index.js';
import { ResponseTransformInterceptor } from './common/interceptors/index.js';

@Module({
    imports: [
        // Rate limiting – 60 requests per 60 seconds per IP
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60_000, limit: 60 }],
        }),
        // In-memory response cache (5 s TTL by default)
        CacheModule.register({
            isGlobal: true,
            ttl: 5_000, // milliseconds
            max: 500, // max cached entries
        }),
        LoggerModule,
        PrismaModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        // Global filter & interceptor (registered via DI for full injection support)
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
        // Guard order: Throttle → API Key → JWT → Roles
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: ApiKeyGuard },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule { }
