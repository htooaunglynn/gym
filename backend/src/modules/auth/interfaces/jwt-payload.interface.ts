import type { Role } from '../../../prisma/prisma.service.js';
export type { Role } from '../../../prisma/prisma.service.js';

/** Shape of `request.user` after Clerk token validation. */
export interface AuthenticatedUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: Role;
}
