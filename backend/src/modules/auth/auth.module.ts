import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';
import { ClerkAuthService } from './clerk-auth.service.js';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, ClerkAuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
