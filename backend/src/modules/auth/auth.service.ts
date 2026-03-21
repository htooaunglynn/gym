import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { randomInt, createHash } from 'node:crypto';
import type { User as ClerkBackendUser } from '@clerk/backend';
import type { AuthenticatedUser } from './interfaces/index.js';
import { UsersService } from '../users/users.service.js';
import { ClerkAuthService } from './clerk-auth.service.js';
import { TokenService } from './token.service.js';
import { EmailService } from './email.service.js';
import type { SignUpDto } from './dto/sign-up.dto.js';
import type { SignInDto } from './dto/sign-in.dto.js';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
}

const BCRYPT_ROUNDS = 12;
const RESET_CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly clerkAuthService: ClerkAuthService,
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService,
    ) { }

    // ── Email / Password Sign-Up ──────────────────────────────────────
    async signUp(dto: SignUpDto): Promise<AuthTokens> {
        const existing = await this.usersService.findByEmail(
            dto.email.toLowerCase(),
        );
        if (existing) {
            throw new ConflictException('Email is already in use');
        }

        const hashedPassword = await hash(dto.password, BCRYPT_ROUNDS);

        const user = await this.usersService.create({
            email: dto.email.toLowerCase(),
            password: hashedPassword,
            name: dto.name ?? null,
        });

        return this.issueTokens(this.toAuthenticatedUser(user));
    }

    // ── Email / Password Sign-In ──────────────────────────────────────
    async signIn(dto: SignInDto): Promise<AuthTokens> {
        const user = await this.usersService.findByEmail(dto.email.toLowerCase());
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const valid = await compare(dto.password, user.password);
        if (!valid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.issueTokens(this.toAuthenticatedUser(user));
    }

    // ── Social Auth (exchange Clerk token for local JWT) ──────────────
    async socialAuth(clerkToken: string): Promise<AuthTokens> {
        const claims = await this.clerkAuthService.verifySessionToken(clerkToken);

        if (typeof claims.sub !== 'string' || claims.sub.length === 0) {
            throw new UnauthorizedException('Invalid Clerk token payload');
        }

        const authenticatedUser = await this.syncUserFromClerk(claims.sub);
        return this.issueTokens(authenticatedUser);
    }

    // ── Refresh Access Token ──────────────────────────────────────────
    async refreshAccessToken(
        rawRefreshToken: string,
    ): Promise<{ accessToken: string }> {
        const userId =
            await this.tokenService.verifyRefreshToken(rawRefreshToken);

        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const accessToken = this.tokenService.generateAccessToken(
            this.toAuthenticatedUser(user),
        );
        return { accessToken };
    }

    // ── Forgot Password ──────────────────────────────────────────────
    async forgotPassword(email: string): Promise<void> {
        const user = await this.usersService.findByEmail(email.toLowerCase());
        if (!user) {
            // Don't reveal whether the email exists
            return;
        }

        const code = String(randomInt(100000, 999999));
        const hashedCode = createHash('sha256').update(code).digest('hex');

        await this.usersService.updateById(user.id, {
            passwordResetCode: hashedCode,
            passwordResetExpiry: new Date(Date.now() + RESET_CODE_EXPIRY_MS),
        });

        await this.emailService.sendPasswordResetCode(user.email, code);
    }

    // ── Reset Password ───────────────────────────────────────────────
    async resetPassword(
        email: string,
        code: string,
        newPassword: string,
    ): Promise<void> {
        const user = await this.usersService.findByEmail(email.toLowerCase());
        if (!user) {
            throw new UnauthorizedException('Invalid reset request');
        }

        if (!user.passwordResetCode || !user.passwordResetExpiry) {
            throw new UnauthorizedException('No password reset was requested');
        }

        if (user.passwordResetExpiry < new Date()) {
            throw new UnauthorizedException('Reset code has expired');
        }

        const hashedCode = createHash('sha256').update(code).digest('hex');
        if (hashedCode !== user.passwordResetCode) {
            throw new UnauthorizedException('Invalid reset code');
        }

        const hashedPassword = await hash(newPassword, BCRYPT_ROUNDS);

        await this.usersService.updateById(user.id, {
            password: hashedPassword,
            passwordResetCode: null,
            passwordResetExpiry: null,
        });

        // Revoke all existing refresh tokens on password reset
        await this.tokenService.revokeAllUserTokens(user.id);
    }

    // ── Logout ────────────────────────────────────────────────────────
    async logout(rawRefreshToken: string): Promise<void> {
        await this.tokenService.revokeRefreshToken(rawRefreshToken);
    }

    // ── Get user profile (for GET /auth/me) ───────────────────────────
    async getProfile(userId: string): Promise<AuthenticatedUser> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.toAuthenticatedUser(user);
    }

    // ── Clerk User Sync (used by socialAuth) ──────────────────────────
    private async syncUserFromClerk(clerkId: string): Promise<AuthenticatedUser> {
        const clerkUser = await this.clerkAuthService.getUser(clerkId);
        const email = this.extractPrimaryEmail(clerkUser).toLowerCase();
        const name = this.extractDisplayName(clerkUser);

        const userByClerkId = await this.usersService.findByClerkId(clerkId);
        if (userByClerkId) {
            const emailChanged = userByClerkId.email !== email;
            const nameChanged = userByClerkId.name !== name;

            if (emailChanged || nameChanged) {
                const updated = await this.usersService.updateById(userByClerkId.id, {
                    email,
                    name,
                });
                return this.toAuthenticatedUser(updated);
            }

            return this.toAuthenticatedUser(userByClerkId);
        }

        const userByEmail = await this.usersService.findByEmail(email);
        if (userByEmail) {
            if (userByEmail.clerkId && userByEmail.clerkId !== clerkId) {
                throw new ConflictException(
                    'Email is already linked to another account',
                );
            }

            const linkedUser = await this.usersService.updateById(userByEmail.id, {
                clerkId,
                name,
            });

            return this.toAuthenticatedUser(linkedUser);
        }

        const createdUser = await this.usersService.create({
            clerkId,
            email,
            name,
            password: null,
        });

        return this.toAuthenticatedUser(createdUser);
    }

    // ── Helpers ───────────────────────────────────────────────────────
    private async issueTokens(user: AuthenticatedUser): Promise<AuthTokens> {
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user.id);
        return { accessToken, refreshToken, user };
    }

    private extractPrimaryEmail(user: ClerkBackendUser): string {
        const primaryEmail = user.primaryEmailAddress?.emailAddress;
        if (primaryEmail) return primaryEmail;

        const fallbackEmail = user.emailAddresses[0]?.emailAddress;
        if (fallbackEmail) return fallbackEmail;

        throw new InternalServerErrorException(
            'Clerk user has no email address configured',
        );
    }

    private extractDisplayName(user: ClerkBackendUser): string | null {
        if (user.fullName && user.fullName.trim().length > 0) {
            return user.fullName;
        }

        const fallbackName = [user.firstName, user.lastName]
            .filter((part): part is string => Boolean(part && part.trim().length > 0))
            .join(' ')
            .trim();

        return fallbackName.length > 0 ? fallbackName : null;
    }

    private toAuthenticatedUser(user: {
        id: string;
        clerkId: string | null;
        email: string;
        name: string | null;
        role: AuthenticatedUser['role'];
    }): AuthenticatedUser {
        return {
            id: user.id,
            clerkId: user.clerkId,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
}
