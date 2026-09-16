import { vi } from 'vitest';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: { update: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    booksService = {
      update: vi.fn().mockResolvedValue({ id: 'book-1' }),
    };

    controller = new BooksController(booksService as unknown as BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call booksService.update with id, dto, and userId in the correct order', async () => {
    const dto = { title: 'Updated title' };
    const request = { user: { id: 'user-1' } } as any;

    await controller.updateBook(dto as any, 'book-1', request);

    expect(booksService.update).toHaveBeenCalledWith('book-1', dto, 'user-1');
  });
});
