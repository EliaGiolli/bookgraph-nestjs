import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookConnectionsService } from './book-connections.service.js';
import { BookConnectionsController } from './book-connections.controller.js';
import { BookConnection } from './entities/book-connection.entity.js';
import { Book } from '../books/entities/books.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([BookConnection, Book])],
  controllers: [BookConnectionsController],
  providers: [BookConnectionsService],
  exports: [BookConnectionsService],
})
export class BookConnectionsModule {}