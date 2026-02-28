import { SetMetadata } from '@nestjs/common';
import type { Role } from '../interfaces/index.js';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to specific roles.
 * Requires JwtAuthGuard to run first so `request.user` is populated.
 *
 * Usage: @Roles(Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
