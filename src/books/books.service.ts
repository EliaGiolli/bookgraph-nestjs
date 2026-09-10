import { Injectable } from '@nestjs/common';
import { books } from '../content/books.js';

@Injectable()
export class BooksService {
    getBooks(){
        return books;
    }
}
