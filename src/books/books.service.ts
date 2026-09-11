import { Injectable } from '@nestjs/common';
import { books } from '../content/books.js';

@Injectable()
export class BooksService {
  getBooks() {
    return books;
  }

  getOne(bookId: number) {
    return books.find((book) => book.id === bookId);
  }

  createBook(book: {
    id: number;
    title: string;
    author: string;
    year: number;
    genre: string;
  }) {
    return [...books, book];
  }
}
