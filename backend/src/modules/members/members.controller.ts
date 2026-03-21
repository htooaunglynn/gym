import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { MembersService } from './members.service.js';
import {
  CreateMemberDto,
  UpdateMemberDto,
  QueryMemberDto,
} from './dto/index.js';
import { Roles } from '../auth/decorators/index.js';

@ApiTags('Members')
@Controller('members')
@ApiBearerAuth()
@Roles('ADMIN')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only).' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5_000)
  @ApiOperation({
    summary: 'List members (paginated, searchable, filterable)',
    description:
      'Returns a list of members with support for pagination, search, and various filters.',
  })
  @ApiResponse({ status: 200, description: 'List of members returned.' })
  findAll(@Query() query: QueryMemberDto) {
    return this.membersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiParam({ name: 'id', description: 'Member ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Member details.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a member' })
  @ApiParam({ name: 'id', description: 'Member ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Member updated successfully.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiParam({ name: 'id', description: 'Member ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Member deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
