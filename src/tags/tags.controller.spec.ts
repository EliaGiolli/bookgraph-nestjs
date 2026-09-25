import { UnauthorizedException } from '@nestjs/common';
import { TagsController } from './tags.controller.js';
import { TagsService } from './tags.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

const TAG_ID = 'd3b07384-d113-424a-a521-30596287f391';
const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

const authed = () => ({ user: { id: USER_ID } }) as AuthenticatedRequest;
const anonymous = () => ({}) as AuthenticatedRequest;

describe('TagsController', () => {
  let controller: TagsController;
  let tagsService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    tagsService = {
      create: vi.fn().mockResolvedValue({ id: TAG_ID }),
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: TAG_ID }),
      update: vi.fn().mockResolvedValue({ id: TAG_ID }),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    controller = new TagsController(tagsService as unknown as TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('requires authentication on every route', () => {
    const guards = Reflect.getMetadata('__guards__', TagsController) ?? [];

    expect(guards).toContain(JwtAuthGuard);
  });

  // Every handler must pass the caller's id through: the tags table has a userId
  // column that nothing previously set or checked.
  describe.each([
    {
      name: 'create',
      call: (r: AuthenticatedRequest) => controller.create({ name: 'Sci-Fi' }, r),
      expected: () => [{ name: 'Sci-Fi' }, USER_ID],
      method: 'create' as const,
    },
    {
      name: 'findAll',
      call: (r: AuthenticatedRequest) => controller.findAll(r),
      expected: () => [USER_ID],
      method: 'findAll' as const,
    },
    {
      name: 'findOne',
      call: (r: AuthenticatedRequest) => controller.findOne(TAG_ID, r),
      expected: () => [TAG_ID, USER_ID],
      method: 'findOne' as const,
    },
    {
      name: 'update',
      call: (r: AuthenticatedRequest) => controller.update(TAG_ID, { name: 'New' }, r),
      expected: () => [TAG_ID, { name: 'New' }, USER_ID],
      method: 'update' as const,
    },
    {
      name: 'remove',
      call: (r: AuthenticatedRequest) => controller.remove(TAG_ID, r),
      expected: () => [TAG_ID, USER_ID],
      method: 'remove' as const,
    },
  ])('$name', ({ call, expected, method }) => {
    it('forwards the authenticated user id', async () => {
      await call(authed());

      expect(tagsService[method]).toHaveBeenCalledWith(...expected());
    });

    it('rejects an unauthenticated request', () => {
      expect(() => call(anonymous())).toThrow(UnauthorizedException);
      expect(tagsService[method]).not.toHaveBeenCalled();
    });
  });

  it('passes the id through as a string, not a number', async () => {
    // The scaffold called the service with `+id`, which is NaN for a UUID.
    await controller.findOne(TAG_ID, authed());

    expect(tagsService.findOne.mock.calls[0][0]).toBe(TAG_ID);
  });
});
