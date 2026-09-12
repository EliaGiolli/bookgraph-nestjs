import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity.js';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>
    ){}

    findAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    findOne(id:string):Promise<Book | null>{
        // the findOneOrFail() method prevents IDOR
        return this.bookRepository.findOneByOrFail({ id });
    }

    async remove(id:string):Promise<void> {
        await this.bookRepository.delete(id);
    }
}
