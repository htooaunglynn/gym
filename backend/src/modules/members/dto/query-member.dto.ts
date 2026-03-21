import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CursorPaginationDto } from '../../../shared/dto/index.js';
import { Gender } from './create-member.dto.js';

export class QueryMemberDto extends CursorPaginationDto {
  @ApiPropertyOptional({ description: 'Search name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ minimum: 0, maximum: 150 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  @Type(() => Number)
  minAge?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 150 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  @Type(() => Number)
  maxAge?: number;

  @ApiPropertyOptional({ example: '1990-01-01T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDateOfBirth?: Date;

  @ApiPropertyOptional({ example: '2010-12-31T23:59:59.999Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDateOfBirth?: Date;
}
