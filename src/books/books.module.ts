import { Module } from '@nestjs/common';
import { BookController } from './book.controller.js';
import { BooksService } from './books.service.js';

@Module({
  controllers: [BookController],
  providers: [BooksService]
})
export class BooksModule {}
