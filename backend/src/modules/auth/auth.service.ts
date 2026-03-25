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
const INVALID_EMAIL_OR_PASSWORD_MESSAGE = 'Invalid email or password';
const PASSWORD_RESET_NOT_REQUESTED_MESSAGE = 'No password reset was requested';
const RESET_CODE_EXPIRED_MESSAGE = 'Reset code has expired';
const INVALID_RESET_CODE_MESSAGE = 'Invalid reset code';

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
        const normalizedEmail = this.normalizeEmail(dto.email);
        const existing = await this.usersService.findByEmail(normalizedEmail);
        if (existing) {
            throw new ConflictException('Email is already in use');
        }

        const hashedPassword = await hash(dto.password, BCRYPT_ROUNDS);

        const user = await this.usersService.create({
            email: normalizedEmail,
            password: hashedPassword,
            name: dto.name ?? null,
        });

        return this.issueTokens(this.toAuthenticatedUser(user));
    }

    // ── Email / Password Sign-In ──────────────────────────────────────
    async signIn(dto: SignInDto): Promise<AuthTokens> {
        const user = await this.usersService.findByEmail(
            this.normalizeEmail(dto.email),
        );
        if (!user || !user.password) {
            throw new UnauthorizedException(INVALID_EMAIL_OR_PASSWORD_MESSAGE);
        }

        const valid = await compare(dto.password, user.password);
        if (!valid) {
            throw new UnauthorizedException(INVALID_EMAIL_OR_PASSWORD_MESSAGE);
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

        const user = await this.getUserOrThrow(userId);

        const accessToken = this.tokenService.generateAccessToken(
            this.toAuthenticatedUser(user),
        );
        return { accessToken };
    }

    // ── Forgot Password ──────────────────────────────────────────────
    async forgotPassword(email: string): Promise<void> {
        const user = await this.usersService.findByEmail(this.normalizeEmail(email));
        if (!user) {
            // Don't reveal whether the email exists
            return;
        }

        const { code, hashedCode, expiresAt } = this.createPasswordResetCode();

        await this.usersService.updateById(user.id, {
            passwordResetCode: hashedCode,
            passwordResetExpiry: expiresAt,
        });

        await this.emailService.sendPasswordResetCode(user.email, code);
    }

    // ── Reset Password ───────────────────────────────────────────────
    async resetPassword(
        email: string,
        code: string,
        newPassword: string,
    ): Promise<void> {
        const user = await this.usersService.findByEmail(this.normalizeEmail(email));
        if (!user) {
            throw new UnauthorizedException('Invalid reset request');
        }

        this.assertPasswordResetCodeIsValid(user, code);

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
        const user = await this.getUserOrThrow(userId);
        return this.toAuthenticatedUser(user);
    }

    // ── Clerk User Sync (used by socialAuth) ──────────────────────────
    private async syncUserFromClerk(clerkId: string): Promise<AuthenticatedUser> {
        const clerkUser = await this.clerkAuthService.getUser(clerkId);
        const email = this.normalizeEmail(this.extractPrimaryEmail(clerkUser));
        const name = this.extractDisplayName(clerkUser);

        const userByClerkId = await this.usersService.findByClerkId(clerkId);
        if (userByClerkId) {
            return this.syncExistingClerkLinkedUser(userByClerkId, email, name);
        }

        const userByEmail = await this.usersService.findByEmail(email);
        if (userByEmail) {
            return this.linkExistingEmailUser(userByEmail, clerkId, name);
        }

        return this.createSocialUser(clerkId, email, name);
    }

    // ── Helpers ───────────────────────────────────────────────────────
    private async issueTokens(user: AuthenticatedUser): Promise<AuthTokens> {
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user.id);
        return { accessToken, refreshToken, user };
    }

    private createPasswordResetCode(): {
        code: string;
        hashedCode: string;
        expiresAt: Date;
    } {
        const code = String(randomInt(100000, 999999));
        return {
            code,
            hashedCode: this.hashValue(code),
            expiresAt: new Date(Date.now() + RESET_CODE_EXPIRY_MS),
        };
    }

    private assertPasswordResetCodeIsValid(
        user: {
            passwordResetCode: string | null;
            passwordResetExpiry: Date | null;
        },
        code: string,
    ): void {
        if (!user.passwordResetCode || !user.passwordResetExpiry) {
            throw new UnauthorizedException(PASSWORD_RESET_NOT_REQUESTED_MESSAGE);
        }

        if (user.passwordResetExpiry < new Date()) {
            throw new UnauthorizedException(RESET_CODE_EXPIRED_MESSAGE);
        }

        if (this.hashValue(code) !== user.passwordResetCode) {
            throw new UnauthorizedException(INVALID_RESET_CODE_MESSAGE);
        }
    }

    private normalizeEmail(email: string): string {
        return email.toLowerCase();
    }

    private async getUserOrThrow(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    private async syncExistingClerkLinkedUser(
        user: {
            id: string;
            clerkId: string | null;
            email: string;
            name: string | null;
            role: AuthenticatedUser['role'];
        },
        email: string,
        name: string | null,
    ): Promise<AuthenticatedUser> {
        const emailChanged = user.email !== email;
        const nameChanged = user.name !== name;

        if (!emailChanged && !nameChanged) {
            return this.toAuthenticatedUser(user);
        }

        const updated = await this.usersService.updateById(user.id, { email, name });
        return this.toAuthenticatedUser(updated);
    }

    private async linkExistingEmailUser(
        user: {
            id: string;
            clerkId: string | null;
        },
        clerkId: string,
        name: string | null,
    ): Promise<AuthenticatedUser> {
        if (user.clerkId && user.clerkId !== clerkId) {
            throw new ConflictException('Email is already linked to another account');
        }

        const linkedUser = await this.usersService.updateById(user.id, {
            clerkId,
            name,
        });

        return this.toAuthenticatedUser(linkedUser);
    }

    private async createSocialUser(
        clerkId: string,
        email: string,
        name: string | null,
    ): Promise<AuthenticatedUser> {
        const createdUser = await this.usersService.create({
            clerkId,
            email,
            name,
            password: null,
        });

        return this.toAuthenticatedUser(createdUser);
    }

    private hashValue(value: string): string {
        return createHash('sha256').update(value).digest('hex');
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
