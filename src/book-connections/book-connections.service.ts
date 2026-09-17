import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookConnection } from './entities/book-connection.entity.js';
import { CreateBookConnectionDto } from './dto/create-book-connection.dto.js';
import { Book } from '../books/entities/books.entity.js';

@Injectable()
export class BookConnectionsService {
  constructor(
    @InjectRepository(BookConnection)
    private readonly connectionRepository: Repository<BookConnection>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createDto: CreateBookConnectionDto, userId: string): Promise<BookConnection> {
    const { sourceBookId, discoveredBookId, description } = createDto;

    // 1. IDOR Validation: Verify that both books belong to the user
    const sourceBook = await this.bookRepository.findOne({
      where: { id: sourceBookId, userId },
    });
    const discoveredBook = await this.bookRepository.findOne({
      where: { id: discoveredBookId, userId },
    });

    if (!sourceBook || !discoveredBook) {
      throw new NotFoundException(
        'One or both books were not found or do not belong to you',
      );
    }

    // 2. Verify if the connection already exists for this user
    const existingConnection = await this.connectionRepository.findOne({
      where: [
        { userId, sourceBookId, discoveredBookId },
        { userId, sourceBookId: discoveredBookId, discoveredBookId: sourceBookId }, // facoltativo: se il grafo è bidirezionale
      ],
    });

    if (existingConnection) {
      throw new ConflictException(
        'A connection between these two books already exists',
      );
    }

    // 3. Creation and storing in the db
    const newConnection = this.connectionRepository.create({
      userId,
      sourceBookId,
      discoveredBookId,
      description,
    });

    return await this.connectionRepository.save(newConnection);
  }
}