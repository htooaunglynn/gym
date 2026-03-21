import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as GeneratedPrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

export type Role = 'ADMIN' | 'MEMBER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type UserCreateInput = {
    clerkId?: string | null;
    email: string;
    password?: string | null;
    name?: string | null;
    role?: Role;
    age?: number | null;
    gender?: Gender | null;
    height?: number | null;
    weight?: number | null;
    dateOfBirth?: Date | null;
    passwordResetCode?: string | null;
    passwordResetExpiry?: Date | null;
};

export type UserUpdateInput = {
    clerkId?: string | null;
    email?: string;
    password?: string | null;
    name?: string | null;
    role?: Role;
    age?: number | null;
    gender?: Gender | null;
    height?: number | null;
    weight?: number | null;
    dateOfBirth?: Date | null;
    passwordResetCode?: string | null;
    passwordResetExpiry?: Date | null;
};

export type DbUser = {
    id: string;
    clerkId: string | null;
    email: string;
    password: string | null;
    name: string | null;
    role: Role;
    age: number | null;
    gender: Gender | null;
    height: number | null;
    weight: number | null;
    dateOfBirth: Date | null;
    passwordResetCode: string | null;
    passwordResetExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

type UserFindManyArgs = {
    take: number;
    skip?: number;
    cursor?: { id: string };
    orderBy: { [key: string]: 'desc' | 'asc' };
    where?: any;
    select?: {
        id?: true;
        email?: true;
        name?: true;
        role?: true;
        age?: true;
        gender?: true;
        height?: true;
        weight?: true;
        dateOfBirth?: true;
        createdAt?: true;
        updatedAt?: true;
    };
};

type PrismaClientLike = {
    $connect: () => Promise<void>;
    $disconnect: () => Promise<void>;
    user: {
        create: (args: { data: UserCreateInput; select?: any }) => Promise<any>;
        update: (args: {
            where: { id: string };
            data: UserUpdateInput;
            select?: any;
        }) => Promise<any>;
        delete: (args: { where: { id: string } }) => Promise<any>;
        findUnique: (args: {
            where: { email: string } | { id: string } | { clerkId: string };
            select?: any;
        }) => Promise<any>;
        findMany: (args: UserFindManyArgs) => Promise<any[]>;
        count: (args?: { where?: any }) => Promise<number>;
    };
    refreshToken: {
        create: (args: { data: any }) => Promise<any>;
        findUnique: (args: { where: any; include?: any }) => Promise<any>;
        delete: (args: { where: any }) => Promise<any>;
        deleteMany: (args: { where: any }) => Promise<any>;
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

    get refreshToken(): PrismaClientLike['refreshToken'] {
        return this.client.refreshToken;
    }

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}
