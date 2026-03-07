import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../interfaces/index.js';
import { AuthService } from '../auth.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<AuthenticatedUser> {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Malformed Authorization header');
    }

    return this.authService.authenticateWithToken(token);
  }
}
