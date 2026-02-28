import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../auth/decorators/index.js';

/**
 * Optional API-key guard. When the environment variable `API_KEY` is set,
 * every non-public request must include a matching `x-api-key` header.
 * If `API_KEY` is not configured the guard is a no-op.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return true; // guard disabled when no API_KEY is configured
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const headerKey = request.headers['x-api-key'];

    if (headerKey !== apiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}
