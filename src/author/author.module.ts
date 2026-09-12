import { Module } from '@nestjs/common';
import { AuthorService } from './author.service.js';
import { AuthorController } from './author.controller.js';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
