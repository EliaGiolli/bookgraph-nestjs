import { AuthorController } from './author.controller.js';
import { AuthorService } from './author.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

const AUTHOR_ID = 'd3b07384-d113-424a-a521-30596287f391';

describe('AuthorController', () => {
  let controller: AuthorController;
  let authorService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authorService = {
      create: vi.fn().mockResolvedValue({ id: AUTHOR_ID }),
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: AUTHOR_ID }),
      update: vi.fn().mockResolvedValue({ id: AUTHOR_ID }),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    controller = new AuthorController(authorService as unknown as AuthorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('requires authentication on every route', () => {
    const guards = Reflect.getMetadata('__guards__', AuthorController) ?? [];

    expect(guards).toContain(JwtAuthGuard);
  });

  it('creates an author', async () => {
    const dto = { name: 'Frank Herbert', bio: 'Wrote Dune.' };

    await controller.create(dto);

    expect(authorService.create).toHaveBeenCalledWith(dto);
  });

  it('lists authors without any per-user filter', async () => {
    // Authors are shared: the handler takes no request and passes no userId.
    await controller.findAll();

    expect(authorService.findAll).toHaveBeenCalledWith();
  });

  it('fetches one author by id', async () => {
    await controller.findOne(AUTHOR_ID);

    expect(authorService.findOne).toHaveBeenCalledWith(AUTHOR_ID);
  });

  it('passes the id through as a string, not a number', async () => {
    // The scaffold called the service with `+id`, which is NaN for a UUID.
    await controller.findOne(AUTHOR_ID);

    const [passed] = authorService.findOne.mock.calls[0];
    expect(passed).toBe(AUTHOR_ID);
    expect(typeof passed).toBe('string');
  });

  it('updates an author', async () => {
    await controller.update(AUTHOR_ID, { bio: 'Updated' });

    expect(authorService.update).toHaveBeenCalledWith(AUTHOR_ID, { bio: 'Updated' });
  });

  it('deletes an author', async () => {
    await controller.remove(AUTHOR_ID);

    expect(authorService.remove).toHaveBeenCalledWith(AUTHOR_ID);
  });
});
