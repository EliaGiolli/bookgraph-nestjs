import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard.js';
import { Roles } from '../decorators/role.decorator.js';
import { UserRole } from '../types/enums/user-role.enum.js';

class TestController {
  openRoute() {}

  @Roles(UserRole.ADMIN)
  adminRoute() {}
}

const contextFor = (handler: (...args: never[]) => unknown, user?: { role: UserRole }) => ({
  getHandler: () => handler,
  getClass: () => TestController,
  switchToHttp: () => ({
    getRequest: () => ({ user }),
  }),
}) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  const guard = new RolesGuard(new Reflector());
  const controller = new TestController();

  it('allows routes without role metadata', () => {
    expect(guard.canActivate(contextFor(controller.openRoute))).toBe(true);
  });

  it('allows a user with a required role', () => {
    expect(guard.canActivate(contextFor(controller.adminRoute, { role: UserRole.ADMIN }))).toBe(true);
  });

  it('denies an incorrect or missing role', () => {
    expect(guard.canActivate(contextFor(controller.adminRoute, { role: UserRole.USER }))).toBe(false);
    expect(guard.canActivate(contextFor(controller.adminRoute))).toBe(false);
  });
});