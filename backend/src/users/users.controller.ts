import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CursorPaginationDto } from '../common/dto/index.js';
import { Roles } from '../auth/decorators/index.js';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(CacheInterceptor) // auto-cache GET responses by URL+query
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @Roles('ADMIN')
  @CacheTTL(5_000) // cache for 5 seconds – prevents duplicate DB hits under load
  @ApiOperation({
    summary: 'List users (cursor-paginated)',
    description:
      'Returns a cursor-paginated list of users. Designed to handle 500k+ records efficiently.',
  })
  findAll(@Query() query: CursorPaginationDto) {
    return this.usersService.findAllPaginated(query);
  }
}
