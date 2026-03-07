import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as GeneratedPrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

export type Role = 'ADMIN' | 'MEMBER';

export type UserCreateInput = {
  clerkId?: string | null;
  email: string;
  password?: string | null;
  name?: string | null;
  role?: Role;
};

export type UserUpdateInput = {
  clerkId?: string | null;
  email?: string;
  password?: string | null;
  name?: string | null;
  role?: Role;
};

export type DbUser = {
  id: string;
  clerkId: string | null;
  email: string;
  password: string | null;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

type UserFindManyArgs = {
  take: number;
  skip?: number;
  cursor?: { id: string };
  orderBy: { createdAt: 'desc' | 'asc' };
  select: {
    id: true;
    email: true;
    name: true;
    role: true;
    createdAt: true;
    updatedAt: true;
  };
};

type UserListItem = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaClientLike = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  user: {
    create: (args: { data: UserCreateInput }) => Promise<DbUser>;
    update: (args: {
      where: { id: string };
      data: UserUpdateInput;
    }) => Promise<DbUser>;
    findUnique: (args: {
      where: { email: string } | { id: string } | { clerkId: string };
    }) => Promise<DbUser | null>;
    findMany: (args: UserFindManyArgs) => Promise<UserListItem[]>;
    count: () => Promise<number>;
  };
};

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClientLike;

  constructor() {
    const PrismaClientCtor = GeneratedPrismaClient as unknown as new (options: {
      adapter: PrismaPg;
    }) => PrismaClientLike;

    this.client = new PrismaClientCtor({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    });
  }

  get user(): PrismaClientLike['user'] {
    return this.client.user;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
