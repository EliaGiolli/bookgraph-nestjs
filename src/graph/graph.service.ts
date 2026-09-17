import { Injectable } from '@nestjs/common';
import { CreateGraphDto } from './dto/create-graph.dto.js';
import { UpdateGraphDto } from './dto/update-graph.dto.js';

@Injectable()
export class GraphService {
  create(createGraphDto: CreateGraphDto) {
    return 'This action adds a new graph';
  }

  findAll() {
    return `This action returns all graph`;
  }

  findOne(id: number) {
    return `This action returns a #${id} graph`;
  }

  update(id: number, updateGraphDto: UpdateGraphDto) {
    return `This action updates a #${id} graph`;
  }

  remove(id: number) {
    return `This action removes a #${id} graph`;
  }
}
