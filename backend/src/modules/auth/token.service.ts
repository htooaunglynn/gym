import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { AuthenticatedUser } from './interfaces/index.js';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class TokenService {
    private readonly refreshExpirationMs: number;

    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
    ) {
        const days = parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? '7', 10);
        this.refreshExpirationMs = days * 24 * 60 * 60 * 1000;
    }

    generateAccessToken(user: AuthenticatedUser): string {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwt.sign(payload);
    }

    async generateRefreshToken(userId: string): Promise<string> {
        const raw = randomBytes(48).toString('hex');
        const hashed = this.hashToken(raw);

        await this.prisma.refreshToken.create({
            data: {
                token: hashed,
                userId,
                expiresAt: this.getRefreshExpiryDate(),
            },
        });

        return raw;
    }

    async verifyRefreshToken(raw: string): Promise<string> {
        const hashed = this.hashToken(raw);

        const record = await this.prisma.refreshToken.findUnique({
            where: { token: hashed },
        });

        if (!record) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (record.expiresAt < new Date()) {
            await this.prisma.refreshToken.delete({ where: { id: record.id } });
            throw new UnauthorizedException('Refresh token expired');
        }

        return record.userId as string;
    }

    async revokeRefreshToken(raw: string): Promise<void> {
        const hashed = this.hashToken(raw);
        try {
            await this.prisma.refreshToken.delete({ where: { token: hashed } });
        } catch {
            // Token may already be deleted — ignore
        }
    }

    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }

    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    private getRefreshExpiryDate(): Date {
        return new Date(Date.now() + this.refreshExpirationMs);
    }
}
