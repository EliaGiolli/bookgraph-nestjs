import { Module } from '@nestjs/common';
import { GraphService } from './graph.service.js';
import { GraphController } from './graph.controller.js';

@Module({
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
