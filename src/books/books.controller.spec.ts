import { vi } from 'vitest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

const BOOK_ID = '11111111-1111-1111-1111-111111111111';
const USER_ID = '22222222-2222-2222-2222-222222222222';

const authed = (id: string = USER_ID) =>
  ({ user: { id } }) as AuthenticatedRequest;
const anonymous = () => ({}) as AuthenticatedRequest;

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    booksService = {
      create: vi.fn().mockResolvedValue({ id: BOOK_ID }),
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: BOOK_ID }),
      update: vi.fn().mockResolvedValue({ id: BOOK_ID }),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    controller = new BooksController(booksService as unknown as BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Every route is authenticated, including the reads: a book belongs to one user.
  it('applies JwtAuthGuard to the whole controller', () => {
    const guards = Reflect.getMetadata('__guards__', BooksController) ?? [];

    expect(guards).toContain(JwtAuthGuard);
  });

  describe('createBook', () => {
    it('passes the authenticated user id through to the service', async () => {
      // Regression guard: `id` used to be an unbound handler parameter, so the
      // service was always called with undefined as the owner.
      const dto = { title: 'Dune', authorId: 'author-1' };

      await controller.createBook(dto as never, authed());

      expect(booksService.create).toHaveBeenCalledWith(dto, USER_ID);
    });

    it('rejects an unauthenticated request', () => {
      expect(() => controller.createBook({ title: 'Dune' } as never, anonymous()))
        .toThrow(UnauthorizedException);
      expect(booksService.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('scopes the listing to the caller', async () => {
      await controller.findAll({}, authed());

      expect(booksService.findAll).toHaveBeenCalledWith({}, USER_ID);
    });

    it('forwards the filter DTO untouched', async () => {
      const filter = { search: 'dune', status: undefined };

      await controller.findAll(filter as never, authed());

      expect(booksService.findAll).toHaveBeenCalledWith(filter, USER_ID);
    });

    it('rejects an unauthenticated request', () => {
      expect(() => controller.findAll({}, anonymous())).toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    it('scopes the lookup to the caller', async () => {
      await controller.findOne(BOOK_ID, authed());

      expect(booksService.findOne).toHaveBeenCalledWith(BOOK_ID, USER_ID);
    });

    it('rejects an unauthenticated request', () => {
      expect(() => controller.findOne(BOOK_ID, anonymous())).toThrow(UnauthorizedException);
    });
  });

  describe('updateBook', () => {
    it('calls the service with id, dto and userId in that order', async () => {
      const dto = { title: 'Updated title' };

      await controller.updateBook(dto as never, BOOK_ID, authed());

      expect(booksService.update).toHaveBeenCalledWith(BOOK_ID, dto, USER_ID);
    });

    it('rejects an unauthenticated request', () => {
      expect(() => controller.updateBook({} as never, BOOK_ID, anonymous()))
        .toThrow(UnauthorizedException);
    });
  });

  describe('deleteBook', () => {
    it('passes the owner id so the service can scope the delete', async () => {
      await controller.deleteBook(BOOK_ID, { id: BOOK_ID } as never, authed());

      expect(booksService.remove).toHaveBeenCalledWith(BOOK_ID, USER_ID);
    });

    it('accepts a body without an id', async () => {
      await controller.deleteBook(BOOK_ID, {} as never, authed());

      expect(booksService.remove).toHaveBeenCalledWith(BOOK_ID, USER_ID);
    });

    it('throws BadRequestException when route and body ids disagree', () => {
      // Used to throw a bare Error, surfacing as a 500 instead of a 400.
      expect(() =>
        controller.deleteBook(BOOK_ID, { id: USER_ID } as never, authed()),
      ).toThrow(BadRequestException);
      expect(booksService.remove).not.toHaveBeenCalled();
    });

    it('rejects an unauthenticated request', () => {
      expect(() => controller.deleteBook(BOOK_ID, {} as never, anonymous()))
        .toThrow(UnauthorizedException);
      expect(booksService.remove).not.toHaveBeenCalled();
    });
  });
});
