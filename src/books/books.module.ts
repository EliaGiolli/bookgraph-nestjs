import { Module } from '@nestjs/common';
import { BookController } from './book.controller.js';
import { BooksService } from './books.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/books.entity.js';
import { BookTag } from './entities/book-tag.entity.js';
import { BookConnection } from './entities/book-connection.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([
    Book, 
    BookTag, 
    BookConnection
  ])],
  controllers: [BookController],
  providers: [BooksService]
})
export class BooksModule {}
