import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorService } from './author.service.js';
import { AuthorController } from './author.controller.js';
import { Author } from './entities/author.entity.js';
import { Book } from '../books/entities/books.entity.js';

@Module({
  // Book is needed to refuse deleting an author that still has books.
  imports: [TypeOrmModule.forFeature([Author, Book])],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
