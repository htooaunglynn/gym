/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, type DbUser } from '../../prisma/prisma.service.js';
import { PaginatedResult } from '../../shared/dto/index.js';
import {
  CreateMemberDto,
  UpdateMemberDto,
  QueryMemberDto,
} from './dto/index.js';

/** Fields safe to return to clients. */
const MEMBER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  age: true,
  gender: true,
  height: true,
  weight: true,
  dateOfBirth: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type MemberPublic = Pick<DbUser, keyof typeof MEMBER_PUBLIC_SELECT>;

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMemberDto): Promise<MemberPublic> {
    return this.prisma.user.create({
      data: {
        ...data,
        role: 'MEMBER',
      },
      select: MEMBER_PUBLIC_SELECT,
    }) as unknown as Promise<MemberPublic>;
  }

  async findAll(query: QueryMemberDto): Promise<PaginatedResult<MemberPublic>> {
    const {
      take,
      cursor,
      search,
      gender,
      minAge,
      maxAge,
      startDateOfBirth,
      endDateOfBirth,
    } = query;

    const where: Record<string, any> = {
      role: 'MEMBER',
    };

    if (search) {
      where['OR'] = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (gender) {
      where['gender'] = gender;
    }

    if (minAge || maxAge) {
      where['age'] = {};
      if (minAge) where['age'].gte = minAge;
      if (maxAge) where['age'].lte = maxAge;
    }

    if (startDateOfBirth || endDateOfBirth) {
      where['dateOfBirth'] = {};
      if (startDateOfBirth) where['dateOfBirth'].gte = startDateOfBirth;
      if (endDateOfBirth) where['dateOfBirth'].lte = endDateOfBirth;
    }

    const [items, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        take: take + 1,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        where: where as any,
        orderBy: { createdAt: 'desc' },
        select: MEMBER_PUBLIC_SELECT,
      }),
      this.prisma.user.count({ where: where as any }),
    ]);

    let nextCursor: string | null = null;
    if (items.length > take) {
      const nextItem = items.pop() as { id: string };
      nextCursor = nextItem.id;
    }

    return new PaginatedResult({
      items: items as unknown as MemberPublic[],
      totalCount,
      nextCursor,
    });
  }

  async findOne(id: string): Promise<MemberPublic> {
    const member = await this.prisma.user.findUnique({
      where: { id },
      select: MEMBER_PUBLIC_SELECT,
    });

    if (!member || member.role !== 'MEMBER') {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return member as unknown as MemberPublic;
  }

  async update(id: string, data: UpdateMemberDto): Promise<MemberPublic> {
    // Ensure it exists and is a member
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data,
      select: MEMBER_PUBLIC_SELECT,
    }) as unknown as Promise<MemberPublic>;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    // Ensure it exists and is a member
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }
}
