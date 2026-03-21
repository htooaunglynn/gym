import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { AuthenticatedUser } from '../interfaces/index.js';
import type { JwtPayload } from '../token.service.js';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly usersService: UsersService) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Missing required env var JWT_SECRET');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
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
