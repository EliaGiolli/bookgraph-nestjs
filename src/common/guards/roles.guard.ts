import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity.js';
import { ROLES_KEY } from '../decorators/role.decorator.js';
import { UserRole } from '../types/enums/user-role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read the roles required by the current route or controller.
    // Method-level metadata takes precedence over controller-level metadata.
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles were declared with @Roles(), allow access.
    // Authentication can still be handled separately by JwtAuthGuard.
    if (!requiredRoles?.length) {
      return true;
    }

    // Retrieve the current HTTP request.
    // JwtAuthGuard and JwtStrategy are responsible for assigning the
    // authenticated user to request.user.
    const request = context
      .switchToHttp()
      .getRequest<{ user?: User }>();

    // Allow access only if the authenticated user's role is included
    // in the list of roles required by the route.
    return request.user !== undefined && requiredRoles.includes(request.user.role);
  }
}