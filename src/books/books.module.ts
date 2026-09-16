import { Module } from '@nestjs/common';
import { BooksController } from './book.controller.js';
import { BooksService } from './books.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/books.entity.js';
import { BookTag } from './entities/book-tag.entity.js';
import { BookConnection } from './entities/book-connection.entity.js';
import { Author } from '../author/entities/author.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([
    Book, 
    BookTag, 
    BookConnection,
    Author,
    User,
  ])],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
