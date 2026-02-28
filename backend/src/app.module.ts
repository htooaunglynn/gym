import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [LoggerModule, PrismaModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
