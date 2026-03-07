import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { User as ClerkBackendUser } from '@clerk/backend';
import type { AuthenticatedUser } from './interfaces/index.js';
import { UsersService } from '../users/users.service.js';
import { ClerkAuthService } from './clerk-auth.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly clerkAuthService: ClerkAuthService,
  ) {}

  async authenticateWithToken(token: string): Promise<AuthenticatedUser> {
    const claims = await this.clerkAuthService.verifySessionToken(token);

    if (typeof claims.sub !== 'string' || claims.sub.length === 0) {
      throw new UnauthorizedException('Invalid Clerk token payload');
    }

    const user = await this.usersService.findByClerkId(claims.sub);
    if (user) {
      return this.toAuthenticatedUser(user);
    }

    return this.syncUserFromClerk(claims.sub);
  }

  async syncUserFromClerk(clerkId: string): Promise<AuthenticatedUser> {
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

        await this.clerkAuthService.updateUserMetadata(clerkId, {
          role: updated.role,
        });

        return this.toAuthenticatedUser(updated);
      }

      await this.clerkAuthService.updateUserMetadata(clerkId, {
        role: userByClerkId.role,
      });

      return this.toAuthenticatedUser(userByClerkId);
    }

    const userByEmail = await this.usersService.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.clerkId && userByEmail.clerkId !== clerkId) {
        throw new ConflictException(
          'Email is already linked to another Clerk account',
        );
      }

      const linkedUser = await this.usersService.updateById(userByEmail.id, {
        clerkId,
        name,
      });

      await this.clerkAuthService.updateUserMetadata(clerkId, {
        role: linkedUser.role,
      });

      return this.toAuthenticatedUser(linkedUser);
    }

    const createdUser = await this.usersService.create({
      clerkId,
      email,
      name,
      password: null,
    });

    await this.clerkAuthService.updateUserMetadata(clerkId, {
      role: createdUser.role,
    });

    return this.toAuthenticatedUser(createdUser);
  }

  private extractPrimaryEmail(user: ClerkBackendUser): string {
    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    if (primaryEmail) {
      return primaryEmail;
    }

    const fallbackEmail = user.emailAddresses[0]?.emailAddress;
    if (fallbackEmail) {
      return fallbackEmail;
    }

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
    if (!user.clerkId) {
      throw new UnauthorizedException('User is not linked with Clerk');
    }

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
