import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BookConnectionsService } from './book-connections.service.js';
import { BookConnection } from './entities/book-connection.entity.js';
import { Book } from '../books/entities/books.entity.js';

const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const OTHER_USER = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';
const BOOK_A = 'd3b07384-d113-424a-a521-30596287f391';
const BOOK_B = 'e5c18495-e224-535b-b632-41607398f402';

describe('BookConnectionsService', () => {
  let service: BookConnectionsService;
  let connectionRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let bookRepository: { findOne: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    connectionRepository = {
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ id: 'conn-1', ...data })),
      findOne: vi.fn().mockResolvedValue(null),
      remove: vi.fn(),
    };
    // Both books exist and belong to the caller unless a test says otherwise.
    bookRepository = {
      findOne: vi.fn(async ({ where }) =>
        where.userId === USER_ID ? { id: where.id, userId: where.userId } : null,
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookConnectionsService,
        { provide: getRepositoryToken(BookConnection), useValue: connectionRepository },
        { provide: getRepositoryToken(Book), useValue: bookRepository },
      ],
    }).compile();

    service = module.get<BookConnectionsService>(BookConnectionsService);
  });

  const dto = { sourceBookId: BOOK_A, discoveredBookId: BOOK_B, description: 'Sequel' };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('persists the connection with the calling user as owner', async () => {
      await service.create(dto, USER_ID);

      expect(connectionRepository.create).toHaveBeenCalledWith({
        userId: USER_ID,
        sourceBookId: BOOK_A,
        discoveredBookId: BOOK_B,
        description: 'Sequel',
      });
      expect(connectionRepository.save).toHaveBeenCalled();
    });

    it('rejects a self-referencing connection', async () => {
      // Defence in depth: the DTO rejects this at the edge, but the service is
      // reachable from other callers too.
      await expect(
        service.create({ ...dto, discoveredBookId: BOOK_A }, USER_ID),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(connectionRepository.save).not.toHaveBeenCalled();
    });

    it('checks self-reference before touching the database', async () => {
      await service
        .create({ ...dto, discoveredBookId: BOOK_A }, USER_ID)
        .catch(() => undefined);

      expect(bookRepository.findOne).not.toHaveBeenCalled();
    });

    it("rejects books that belong to another user", async () => {
      await expect(service.create(dto, OTHER_USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(connectionRepository.save).not.toHaveBeenCalled();
    });

    it('rejects when only one of the two books is missing', async () => {
      bookRepository.findOne.mockImplementation(async ({ where }) =>
        where.id === BOOK_A ? { id: BOOK_A, userId: USER_ID } : null,
      );

      await expect(service.create(dto, USER_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects a duplicate connection', async () => {
      connectionRepository.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.create(dto, USER_ID)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(connectionRepository.save).not.toHaveBeenCalled();
    });

    it('treats the reversed pair as a duplicate, scoped to the owner', async () => {
      await service.create(dto, USER_ID);

      expect(connectionRepository.findOne).toHaveBeenCalledWith({
        where: [
          { userId: USER_ID, sourceBookId: BOOK_A, discoveredBookId: BOOK_B },
          { userId: USER_ID, sourceBookId: BOOK_B, discoveredBookId: BOOK_A },
        ],
      });
    });
  });

  describe('remove', () => {
    it('deletes a connection the caller owns', async () => {
      const connection = { id: 'conn-1', userId: USER_ID };
      connectionRepository.findOne.mockResolvedValue(connection);

      await service.remove('conn-1', USER_ID);

      expect(connectionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'conn-1', userId: USER_ID },
      });
      expect(connectionRepository.remove).toHaveBeenCalledWith(connection);
    });

    it("refuses to delete another user's connection", async () => {
      connectionRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('conn-1', OTHER_USER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(connectionRepository.remove).not.toHaveBeenCalled();
    });
  });
});
