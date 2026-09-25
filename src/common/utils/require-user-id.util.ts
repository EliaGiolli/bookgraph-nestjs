import { UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

// JwtAuthGuard should have populated request.user before any handler runs, but
// the type is optional and a route can always be wired up without the guard.
// One shared assertion keeps every controller honest about that.
export function requireUserId(request: AuthenticatedRequest): string {
  const userId = request.user?.id;

  if (!userId) {
    throw new UnauthorizedException('User not authenticated');
  }

  return userId;
}
