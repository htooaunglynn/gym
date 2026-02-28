import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerModule } from './logger/logger.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/index.js';
import { RolesGuard } from './auth/guards/index.js';
import { ApiKeyGuard } from './common/guards/index.js';

@Module({
    imports: [
        // Rate limiting – 60 requests per 60 seconds per IP
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60_000, limit: 60 }],
        }),
        LoggerModule,
        PrismaModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // Guard order: Throttle → API Key → JWT → Roles
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: ApiKeyGuard },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule { }
