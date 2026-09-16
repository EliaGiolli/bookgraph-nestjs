import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity.js';
import { Author } from '../author/entities/author.entity.js';
import { User } from '../users/entities/user.entity.js';
// DTOs  
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { GetBooksFilterDto } from './dto/get-book-filter.dto.js';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(Author)
        private authorRepository: Repository<Author>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){}

    async create(createBookDto: CreateBookDto, userId: string): Promise<Book> {
        const { authorId, ...bookData } = createBookDto;

        const author = await this.authorRepository.findOneBy({ id: authorId });

        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found`);
        }

        const user = await this.usersRepository.findOneBy({ id: userId });
        
        if (!user) {
            throw new NotFoundException(`User with ID "${userId}" not found`);
        }

        const book = this.bookRepository.create({
            ...bookData,
            author,
            user,
        });

        return await this.bookRepository.save(book);
    }


    async findAll(filterDto: GetBooksFilterDto): Promise<Book[]> {
        const { search, authorId, tagId, status } = filterDto;
        
        const query = this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.author', 'author')
            .leftJoinAndSelect('book.user', 'user')
            .leftJoinAndSelect('book.bookTags', 'bookTag')
            .leftJoinAndSelect('bookTag.tag', 'tag');

        // Filtro per ricerca testuale (titolo o nome dell'autore)
        if (search) {
            query.andWhere(
                '(LOWER(book.title) LIKE LOWER(:search) OR LOWER(author.name) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }

        // Filtro per ID autore specifico
        if (authorId) {
            query.andWhere('author.id = :authorId', { authorId });
        }

        // Filtro per ID tag specifico
        if (tagId) {
            query.andWhere('tag.id = :tagId', { tagId });
        }

        return await query.getMany();
    }

   async findOne(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: {
                author: true,
                user: true,
                bookTags: {
                tag: true,
                },
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

    async update(id: string, updateBookDto: UpdateBookDto, userId: string): Promise<Book> {
        const { authorId, ...bookData } = updateBookDto;

        const book = await this.bookRepository.findOne({
            where: { id, userId },
            relations: { author: true },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID "${id}" not found or unauthorized`);
        }

        if (authorId) {
            const author = await this.authorRepository.findOneBy({ id: authorId });
            if (!author) {
                throw new NotFoundException(`Author with ID "${authorId}" not found`);
            }
            book.author = author;
        }

        // Updates the fields and saves the entity
        Object.assign(book, bookData);

        return await this.bookRepository.save(book);
    }
}
