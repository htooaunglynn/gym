import { Module } from '@nestjs/common';
import { MembersService } from './members.service.js';
import { MembersController } from './members.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
