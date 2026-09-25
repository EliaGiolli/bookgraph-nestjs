import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GraphService } from './graph.service.js';
import { GraphResponseDto } from './dto/graph-response.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { requireUserId } from '../common/utils/require-user-id.util.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@ApiTags('Graph')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Get()
  @ApiOperation({ summary: 'Get the full graph payload formatted for vis-network' })
  @ApiResponse({
    status: 200,
    description: 'Graph nodes and edges successfully retrieved.',
    type: GraphResponseDto,
  })
  async getGraph(@Req() req: AuthenticatedRequest): Promise<GraphResponseDto> {
    return this.graphService.getUserGraph(requireUserId(req));
  }
}