import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller.js';
import { LoggerModule } from './core/logger/logger.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { MembersModule } from './modules/members/members.module.js';
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards/index.js';
import { ApiKeyGuard } from './core/guards/index.js';
import { GlobalExceptionFilter } from './core/filters/index.js';
import { ResponseTransformInterceptor } from './core/interceptors/index.js';

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
    MembersModule,
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
export class AppModule {}
