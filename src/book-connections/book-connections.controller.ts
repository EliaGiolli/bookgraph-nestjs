import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookConnectionsService } from './book-connections.service.js';
import { CreateBookConnectionDto } from './dto/create-book-connection.dto.js';
import { UpdateBookConnectionDto } from './dto/update-book-connection.dto.js';

@Controller('book-connections')
export class BookConnectionsController {
  constructor(private readonly bookConnectionsService: BookConnectionsService) {}

  @Post()
  create(@Body() createBookConnectionDto: CreateBookConnectionDto) {
    return this.bookConnectionsService.create(createBookConnectionDto);
  }

  @Get()
  findAll() {
    return this.bookConnectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookConnectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookConnectionDto: UpdateBookConnectionDto) {
    return this.bookConnectionsService.update(+id, updateBookConnectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookConnectionsService.remove(+id);
  }
}
