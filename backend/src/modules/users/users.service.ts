import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  type DbUser,
  type Role,
  type UserCreateInput,
} from '../../prisma/prisma.service.js';
import {
  CursorPaginationDto,
  PaginatedResult,
} from '../../shared/dto/index.js';

/** Fields safe to return to clients (no password). */
const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserPublic = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: UserCreateInput): Promise<DbUser> {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string): Promise<DbUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<DbUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Cursor-based paginated listing — O(1) seek regardless of page depth.
   *
   * How it works:
   *  1. If a `cursor` is supplied we tell Prisma to start **after** that id.
   *  2. We always fetch `take + 1` rows; if we get the extra row it means
   *     there is at least one more page (we trim it before returning).
   *  3. `totalCount` is fetched in parallel so the client can show "page X of Y".
   */
  async findAllPaginated(
    dto: CursorPaginationDto,
  ): Promise<PaginatedResult<UserPublic>> {
    const { take, cursor } = dto;

    const [items, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        take: take + 1, // one extra to detect next page
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { createdAt: 'desc' },
        select: USER_PUBLIC_SELECT,
      }),
      this.prisma.user.count(),
    ]);

    let nextCursor: string | null = null;
    if (items.length > take) {
      const nextItem = items.pop()!; // remove the extra sentinel row
      nextCursor = nextItem.id;
    }

    return new PaginatedResult({ items, totalCount, nextCursor });
  }
}
