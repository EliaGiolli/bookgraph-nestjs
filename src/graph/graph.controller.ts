import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { GraphService } from './graph.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Controller('graph')
@UseGuards(JwtAuthGuard)
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  async getGraph(@Req() req: any) {
    const userId = req.user.id;
    return this.graphService.getUserGraph(userId);
  }
}