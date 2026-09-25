import { UnauthorizedException } from '@nestjs/common';
import { GraphController } from './graph.controller.js';
import { GraphService } from './graph.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

describe('GraphController', () => {
  let controller: GraphController;
  let graphService: { getUserGraph: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    graphService = { getUserGraph: vi.fn().mockResolvedValue({ nodes: [], edges: [] }) };
    controller = new GraphController(graphService as unknown as GraphService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('is guarded by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata('__guards__', GraphController) ?? [];

    expect(guards).toContain(JwtAuthGuard);
  });

  it('asks for the graph of the authenticated user only', async () => {
    await controller.getGraph({ user: { id: USER_ID } } as AuthenticatedRequest);

    expect(graphService.getUserGraph).toHaveBeenCalledWith(USER_ID);
  });

  it('rejects an unauthenticated request', async () => {
    await expect(controller.getGraph({} as AuthenticatedRequest)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(graphService.getUserGraph).not.toHaveBeenCalled();
  });
});
