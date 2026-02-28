import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthenticatedUser, JwtPayload } from '../interfaces/index.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!,
        });
    }

    /** Passport attaches the return value to `request.user`. */
    validate(payload: JwtPayload): AuthenticatedUser {
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name ?? null,
            role: payload.role,
        };
    }
}
