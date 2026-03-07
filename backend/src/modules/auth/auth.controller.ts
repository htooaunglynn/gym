import { Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/index.js';
import type { AuthenticatedUser } from './interfaces/index.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync the current Clerk user to local database' })
  syncCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.syncUserFromClerk(user.clerkId);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
