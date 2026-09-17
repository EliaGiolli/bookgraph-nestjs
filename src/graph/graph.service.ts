import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/books.entity.js';
import { BookConnection } from '../book-connections/entities/book-connection.entity.js';
import { GraphResponseDto } from './dto/graph-response.dto.js';

@Injectable()
export class GraphService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookConnection)
    private readonly connectionRepository: Repository<BookConnection>,
  ) {}

  async getUserGraph(userId: string): Promise<GraphResponseDto> {
    // Fetch in parallel
    const [books, connections] = await Promise.all([
      this.bookRepository.find({ where: { userId } }),
      this.connectionRepository.find({ where: { userId } }),
    ]);

    // Mapping for the structure of vis-network
    const nodes = books.map((book) => ({
      id: book.id,
      label: book.title,
      group: book.status,
    }));

    const edges = connections.map((conn) => ({
      id: conn.id,
      from: conn.sourceBookId,
      to: conn.discoveredBookId,
      label: conn.description || undefined,
    }));

    return { nodes, edges };
  }
}