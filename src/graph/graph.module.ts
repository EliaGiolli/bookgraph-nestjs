import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphController } from './graph.controller.js';
import { GraphService } from './graph.service.js';
import { Book } from '../books/entities/books.entity.js';
import { BookConnection } from '../book-connections/entities/book-connection.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookConnection])],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}