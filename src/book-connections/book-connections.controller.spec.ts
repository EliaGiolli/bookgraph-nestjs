import { UnauthorizedException } from '@nestjs/common';
import { BookConnectionsController } from './book-connections.controller.js';
import { BookConnectionsService } from './book-connections.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const BOOK_A = 'd3b07384-d113-424a-a521-30596287f391';
const BOOK_B = 'e5c18495-e224-535b-b632-41607398f402';

const authed = () => ({ user: { id: USER_ID } }) as AuthenticatedRequest;
const anonymous = () => ({}) as AuthenticatedRequest;

describe('BookConnectionsController', () => {
  let controller: BookConnectionsController;
  let connectionsService: {
    create: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    connectionsService = {
      create: vi.fn().mockResolvedValue({ id: 'conn-1' }),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    controller = new BookConnectionsController(
      connectionsService as unknown as BookConnectionsService,
    );
  });

  const dto = { sourceBookId: BOOK_A, discoveredBookId: BOOK_B };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('is guarded by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata('__guards__', BookConnectionsController) ?? [];

    expect(guards).toContain(JwtAuthGuard);
  });

  describe('create', () => {
    it('forwards the authenticated user id', async () => {
      await controller.create(dto as never, authed());

      expect(connectionsService.create).toHaveBeenCalledWith(dto, USER_ID);
    });

    it('rejects an unauthenticated request instead of dereferencing undefined', async () => {
      // The request was typed as `any` and read as req.user.id, which would have
      // thrown a TypeError (500) rather than a 401 if the user were ever absent.
      await expect(controller.create(dto as never, anonymous())).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(connectionsService.create).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('forwards the authenticated user id', async () => {
      await controller.remove('conn-1', authed());

      expect(connectionsService.remove).toHaveBeenCalledWith('conn-1', USER_ID);
    });

    it('rejects an unauthenticated request', async () => {
      await expect(controller.remove('conn-1', anonymous())).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(connectionsService.remove).not.toHaveBeenCalled();
    });
  });
});
