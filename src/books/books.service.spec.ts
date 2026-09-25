import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { Book } from './entities/books.entity.js';
import { Author } from '../author/entities/author.entity.js';
import { User } from '../users/entities/user.entity.js';
import { BookRole } from '../common/types/enums/book-role.enum.js';

const BOOK_ID = '11111111-1111-1111-1111-111111111111';
const USER_ID = '22222222-2222-2222-2222-222222222222';
const AUTHOR_ID = '33333333-3333-3333-3333-333333333333';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let authorRepository: { findOneBy: ReturnType<typeof vi.fn> };
  let usersRepository: { findOneBy: ReturnType<typeof vi.fn> };
  let query: {
    leftJoinAndSelect: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    andWhere: ReturnType<typeof vi.fn>;
    getMany: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    query = {
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([]),
    };
    bookRepository = {
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ id: BOOK_ID, ...data })),
      findOne: vi.fn(),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: vi.fn(() => query),
    };
    authorRepository = { findOneBy: vi.fn().mockResolvedValue({ id: AUTHOR_ID }) };
    usersRepository = { findOneBy: vi.fn().mockResolvedValue({ id: USER_ID }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useValue: bookRepository },
        { provide: getRepositoryToken(Author), useValue: authorRepository },
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { title: 'Dune', authorId: AUTHOR_ID };

    it('attaches the author and the owning user', async () => {
      await service.create(dto as never, USER_ID);

      expect(bookRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Dune', author: { id: AUTHOR_ID }, user: { id: USER_ID } }),
      );
    });

    it('throws NotFoundException for an unknown author', async () => {
      authorRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto as never, USER_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(bookRepository.save).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for an unknown user', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto as never, USER_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(bookRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('restricts the query to the calling user', async () => {
      await service.findAll({}, USER_ID);

      expect(query.where).toHaveBeenCalledWith('book.userId = :userId', {
        userId: USER_ID,
      });
    });

    it('applies the status filter', async () => {
      // `status` was destructured out of the DTO and then never used, so
      // ?status=read silently returned every book.
      await service.findAll({ status: BookRole.READ }, USER_ID);

      expect(query.andWhere).toHaveBeenCalledWith('book.status = :status', {
        status: BookRole.READ,
      });
    });

    it.each([
      ['search', { search: 'dune' }],
      ['authorId', { authorId: AUTHOR_ID }],
      ['tagId', { tagId: '44444444-4444-4444-4444-444444444444' }],
    ])('applies the %s filter', async (_name, filter) => {
      await service.findAll(filter as never, USER_ID);

      expect(query.andWhere).toHaveBeenCalled();
    });

    it('adds no filters when none are supplied', async () => {
      await service.findAll({}, USER_ID);

      expect(query.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('scopes the lookup by owner', async () => {
      bookRepository.findOne.mockResolvedValue({ id: BOOK_ID });

      await service.findOne(BOOK_ID, USER_ID);

      expect(bookRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: BOOK_ID, userId: USER_ID } }),
      );
    });

    it("throws NotFoundException for another user's book", async () => {
      bookRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(BOOK_ID, USER_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('scopes the delete to the owner', async () => {
      await service.remove(BOOK_ID, USER_ID);

      // An unscoped delete(id) would remove any user's book.
      expect(bookRepository.delete).toHaveBeenCalledWith({ id: BOOK_ID, userId: USER_ID });
    });

    it('throws NotFoundException when nothing was deleted', async () => {
      bookRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(BOOK_ID, USER_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('scopes the lookup by owner', async () => {
      bookRepository.findOne.mockResolvedValue({ id: BOOK_ID, title: 'Old' });

      await service.update(BOOK_ID, { title: 'New' } as never, USER_ID);

      expect(bookRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: BOOK_ID, userId: USER_ID } }),
      );
      expect(bookRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New' }),
      );
    });

    it("throws NotFoundException for another user's book", async () => {
      bookRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(BOOK_ID, { title: 'New' } as never, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('swaps the author when a new authorId is given', async () => {
      bookRepository.findOne.mockResolvedValue({ id: BOOK_ID, author: { id: 'old' } });

      await service.update(BOOK_ID, { authorId: AUTHOR_ID } as never, USER_ID);

      expect(bookRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ author: { id: AUTHOR_ID } }),
      );
    });

    it('throws NotFoundException for an unknown new author', async () => {
      bookRepository.findOne.mockResolvedValue({ id: BOOK_ID });
      authorRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(BOOK_ID, { authorId: AUTHOR_ID } as never, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
