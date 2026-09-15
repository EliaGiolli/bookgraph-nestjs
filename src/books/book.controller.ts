import { 
    Controller, 
    Get, 
    Param 
} from '@nestjs/common';
import { BooksService } from './books.service.js';

@Controller('books')
export class BookController {
    constructor(private booksService: BooksService) {}

    @Get()
    findAllBooks() {
        return this.booksService.findAll()
    }

    @Get(':id')
    findBookById(@Param('id') id:string) {
        return this.booksService.findOne(id)
    }
}
