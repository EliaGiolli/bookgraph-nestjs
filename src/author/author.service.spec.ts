import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service.js';
import { Author } from './entities/author.entity.js';
import { Book } from '../books/entities/books.entity.js';

const AUTHOR_ID = 'd3b07384-d113-424a-a521-30596287f391';

describe('AuthorService', () => {
  let service: AuthorService;
  let authorRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let bookRepository: { count: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authorRepository = {
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ id: AUTHOR_ID, ...data })),
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: AUTHOR_ID, name: 'Frank Herbert' }),
      remove: vi.fn(),
    };
    bookRepository = { count: vi.fn().mockResolvedValue(0) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        { provide: getRepositoryToken(Author), useValue: authorRepository },
        { provide: getRepositoryToken(Book), useValue: bookRepository },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('persists the author', async () => {
      const dto = { name: 'Frank Herbert', bio: 'Wrote Dune.' };

      await expect(service.create(dto)).resolves.toMatchObject({ id: AUTHOR_ID });
      expect(authorRepository.create).toHaveBeenCalledWith(dto);
      expect(authorRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns every author, ordered by name', async () => {
      // Authors are shared reference data: no userId filter belongs here.
      await service.findAll();

      expect(authorRepository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
    });
  });

  describe('findOne', () => {
    it('returns the author', async () => {
      await expect(service.findOne(AUTHOR_ID)).resolves.toMatchObject({ id: AUTHOR_ID });
    });

    it('throws NotFoundException for an unknown id', async () => {
      authorRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(AUTHOR_ID)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('merges the patch onto the existing author', async () => {
      await service.update(AUTHOR_ID, { bio: 'Updated bio' });

      expect(authorRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: AUTHOR_ID, bio: 'Updated bio' }),
      );
    });

    it('throws NotFoundException for an unknown id', async () => {
      authorRepository.findOne.mockResolvedValue(null);

      await expect(service.update(AUTHOR_ID, { bio: 'x' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(authorRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes an author with no books', async () => {
      await service.remove(AUTHOR_ID);

      expect(bookRepository.count).toHaveBeenCalledWith({ where: { authorId: AUTHOR_ID } });
      expect(authorRepository.remove).toHaveBeenCalled();
    });

    it('refuses to delete an author that still has books', async () => {
      // books.authorId is ON DELETE RESTRICT; without this check the driver error
      // would surface as a 500 instead of a 409.
      bookRepository.count.mockResolvedValue(3);

      await expect(service.remove(AUTHOR_ID)).rejects.toBeInstanceOf(ConflictException);
      expect(authorRepository.remove).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for an unknown id', async () => {
      authorRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(AUTHOR_ID)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
