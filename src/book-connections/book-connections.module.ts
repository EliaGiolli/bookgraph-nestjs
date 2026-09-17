import { Module } from '@nestjs/common';
import { BookConnectionsService } from './book-connections.service.js';
import { BookConnectionsController } from './book-connections.controller.js';

@Module({
  controllers: [BookConnectionsController],
  providers: [BookConnectionsService],
})
export class BookConnectionsModule {}
