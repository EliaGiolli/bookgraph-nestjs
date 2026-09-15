import { Injectable, NotFoundException } from '@nestjs/common';
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
        return this.bookRepository.find({
            // loads author and user into the payload
            relations: {
                author: true,
                user: true,
            }
        });
    }

    async findOne(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: {
                author: true,
                user: true,
            },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID "${id}" not found`);
        }

        return book;
    }

    async remove(id:string):Promise<void> {
        await this.bookRepository.delete(id);
    }
}
