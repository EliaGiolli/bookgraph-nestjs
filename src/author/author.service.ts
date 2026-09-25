import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity.js';
import { Book } from '../books/entities/books.entity.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { UpdateAuthorDto } from './dto/update-author.dto.js';

// Authors are shared: the table has no userId and every user's books point at
// the same rows, so there is no ownership filter to apply here.
@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.authorRepository.create(createAuthorDto);

    return await this.authorRepository.save(author);
  }

  async findAll(): Promise<Author[]> {
    return await this.authorRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found`);
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);

    Object.assign(author, updateAuthorDto);

    return await this.authorRepository.save(author);
  }

  async remove(id: string): Promise<void> {
    const author = await this.findOne(id);

    // books.authorId is ON DELETE RESTRICT, so deleting a referenced author
    // raises a driver error that would surface as a 500. Report the conflict
    // instead, and count across all users since authors are shared.
    const bookCount = await this.bookRepository.count({ where: { authorId: id } });

    if (bookCount > 0) {
      throw new ConflictException(
        `Author "${author.name}" still has ${bookCount} book(s) and cannot be deleted`,
      );
    }

    await this.authorRepository.remove(author);
  }
}
