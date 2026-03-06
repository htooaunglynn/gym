import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard paginated response envelope.
 *
 * Works with the existing ResponseTransformInterceptor – this becomes the
 * `data` field inside the top-level { statusCode, message, data } envelope.
 */
export class PaginatedResult<T> {
  @ApiProperty({ description: 'Array of items for this page' })
  items: T[];

  @ApiProperty({ description: 'Total count of matching records' })
  totalCount: number;

  @ApiPropertyOptional({
    description:
      'Cursor to fetch the next page. `null` when there are no more pages.',
    nullable: true,
  })
  nextCursor: string | null;

  @ApiProperty({ description: 'Whether more pages exist' })
  hasMore: boolean;

  constructor(data: {
    items: T[];
    totalCount: number;
    nextCursor: string | null;
  }) {
    this.items = data.items;
    this.totalCount = data.totalCount;
    this.nextCursor = data.nextCursor;
    this.hasMore = data.nextCursor !== null;
  }
}
