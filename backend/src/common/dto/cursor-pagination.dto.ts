import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Cursor-based pagination query DTO.
 *
 * Cursor pagination is O(1) regardless of page depth, making it ideal for
 * datasets with 500k+ rows where OFFSET-based pagination degrades badly.
 */
export class CursorPaginationDto {
    @ApiPropertyOptional({
        description: 'Number of items to return (max 100)',
        default: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    take: number = 20;

    @ApiPropertyOptional({
        description:
            'Cursor – the `id` of the last item from the previous page. Omit for the first page.',
    })
    @IsOptional()
    @IsString()
    cursor?: string;
}
