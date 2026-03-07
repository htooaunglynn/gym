import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthService {
  private readonly secretKey: string;
  private readonly jwtKey?: string;
  private readonly authorizedParties?: string[];

  private readonly clerkClient;

  constructor() {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Missing required env var CLERK_SECRET_KEY');
    }

    this.secretKey = secretKey;
    this.jwtKey = process.env.CLERK_JWT_KEY;
    this.authorizedParties = process.env.CLERK_AUTHORIZED_PARTIES?.split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    this.clerkClient = createClerkClient({ secretKey: this.secretKey });
  }

  async verifySessionToken(token: string) {
    try {
      return await verifyToken(token, {
        secretKey: this.secretKey,
        ...(this.jwtKey ? { jwtKey: this.jwtKey } : {}),
        ...(this.authorizedParties && this.authorizedParties.length > 0
          ? { authorizedParties: this.authorizedParties }
          : {}),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired Clerk token');
    }
  }

  async getUser(userId: string) {
    try {
      return await this.clerkClient.users.getUser(userId);
    } catch {
      throw new UnauthorizedException('Unable to fetch Clerk user');
    }
  }
}
