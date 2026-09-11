import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  findAll() {
    return this.bookService.getBooks();
  }

  @Get(':id')
  findOneBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.getOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateBookDto) {
    return this.bookService.createBook(createUserDto)
  }
}
