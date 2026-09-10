import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service.js';

@Controller('book')
export class BookController {
    constructor(private bookService: BooksService) {}


    @Get()
    findAll(){
        return this.bookService.getBooks();
    }
}
