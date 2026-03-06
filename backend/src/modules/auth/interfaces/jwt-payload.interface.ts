import type { Role } from '../../../prisma/prisma.service.js';
export type { Role } from '../../../prisma/prisma.service.js';

/** Payload encoded inside the JWT token. */
export interface JwtPayload {
  sub: string;
  email: string;
  name: string | null;
  role: Role;
}

/** Shape of `request.user` after JWT validation. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}
