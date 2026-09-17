import { Injectable } from '@nestjs/common';
import { CreateBookConnectionDto } from './dto/create-book-connection.dto.js';
import { UpdateBookConnectionDto } from './dto/update-book-connection.dto.js';

@Injectable()
export class BookConnectionsService {
  create(createBookConnectionDto: CreateBookConnectionDto) {
    return 'This action adds a new bookConnection';
  }

  findAll() {
    return `This action returns all bookConnections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookConnection`;
  }

  update(id: number, updateBookConnectionDto: UpdateBookConnectionDto) {
    return `This action updates a #${id} bookConnection`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookConnection`;
  }
}
