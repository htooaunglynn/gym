import { Role } from '../../../generated/prisma/enums.js';

/** Payload encoded inside the JWT token. */
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}

/** Shape of `request.user` after JWT validation. */
export interface AuthenticatedUser {
    id: string;
    email: string;
    role: Role;
}
