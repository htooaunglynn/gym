import type { Role } from '../../../prisma/prisma.service.js';
export type { Role } from '../../../prisma/prisma.service.js';

/** Shape of `request.user` after JWT token validation. */
export interface AuthenticatedUser {
    id: string;
    clerkId: string | null;
    email: string;
    name: string | null;
    role: Role;
}
