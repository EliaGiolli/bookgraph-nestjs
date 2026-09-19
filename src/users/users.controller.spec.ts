import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/types/enums/user-role.enum.js';
import { ROLES_KEY } from '../common/decorators/role.decorator.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

// Minimal stand-in for the request JwtStrategy populates.
const requestAs = (id: string, role: UserRole) =>
  ({ user: { id, role } }) as AuthenticatedRequest;

const OWNER_ID = '11111111-1111-1111-1111-111111111111';
const OTHER_ID = '22222222-2222-2222-2222-222222222222';
const ADMIN_ID = '33333333-3333-3333-3333-333333333333';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOneById: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    usersService = {
      create: vi.fn().mockResolvedValue({ id: OWNER_ID }),
      findAll: vi.fn().mockResolvedValue([]),
      findOneById: vi.fn().mockResolvedValue({ id: OWNER_ID }),
      update: vi.fn().mockResolvedValue({ id: OWNER_ID }),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Ownership: each handler must reject a caller acting on someone else's account.
  describe.each([
    {
      name: 'findOne',
      call: (request: AuthenticatedRequest) => controller.findOne(OWNER_ID, request),
      serviceMethod: 'findOneById' as const,
    },
    {
      name: 'update',
      call: (request: AuthenticatedRequest) =>
        controller.update(OWNER_ID, { name: 'Augusta' }, request),
      serviceMethod: 'update' as const,
    },
    {
      name: 'remove',
      call: (request: AuthenticatedRequest) => controller.remove(OWNER_ID, request),
      serviceMethod: 'remove' as const,
    },
  ])('$name', ({ call, serviceMethod }) => {
    it('allows the owner to act on their own account', async () => {
      await expect(call(requestAs(OWNER_ID, UserRole.USER))).resolves.not.toThrow();
      expect(usersService[serviceMethod]).toHaveBeenCalled();
    });

    it('allows an ADMIN to act on any account', async () => {
      await expect(call(requestAs(ADMIN_ID, UserRole.ADMIN))).resolves.not.toThrow();
      expect(usersService[serviceMethod]).toHaveBeenCalled();
    });

    it('rejects a non-admin acting on another account (IDOR)', () => {
      expect(() => call(requestAs(OTHER_ID, UserRole.USER))).toThrow(ForbiddenException);
      expect(usersService[serviceMethod]).not.toHaveBeenCalled();
    });

    it('rejects an unauthenticated request', () => {
      expect(() => call({} as AuthenticatedRequest)).toThrow(UnauthorizedException);
      expect(usersService[serviceMethod]).not.toHaveBeenCalled();
    });
  });

  // Role metadata: RolesGuard is stubbed above, so assert the decorators instead.
  describe('role-restricted routes', () => {
    const reflector = new Reflector();

    it.each([['create'], ['findAll']])(
      'restricts %s to ADMIN',
      (handler: string) => {
        const roles = reflector.get<UserRole[]>(
          ROLES_KEY,
          UsersController.prototype[handler as 'create' | 'findAll'],
        );

        expect(roles).toEqual([UserRole.ADMIN]);
      },
    );
  });
});
