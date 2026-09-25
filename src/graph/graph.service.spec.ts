import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GraphService } from './graph.service.js';
import { Book } from '../books/entities/books.entity.js';
import { BookConnection } from '../book-connections/entities/book-connection.entity.js';
import { BookRole } from '../common/types/enums/book-role.enum.js';

const USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const BOOK_A = 'd3b07384-d113-424a-a521-30596287f391';
const BOOK_B = 'e5c18495-e224-535b-b632-41607398f402';

describe('GraphService', () => {
  let service: GraphService;
  let bookRepository: { find: ReturnType<typeof vi.fn> };
  let connectionRepository: { find: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    bookRepository = { find: vi.fn().mockResolvedValue([]) };
    connectionRepository = { find: vi.fn().mockResolvedValue([]) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        { provide: getRepositoryToken(Book), useValue: bookRepository },
        { provide: getRepositoryToken(BookConnection), useValue: connectionRepository },
      ],
    }).compile();

    service = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('scopes both queries to the given user', async () => {
    await service.getUserGraph(USER_ID);

    expect(bookRepository.find).toHaveBeenCalledWith({ where: { userId: USER_ID } });
    expect(connectionRepository.find).toHaveBeenCalledWith({
      where: { userId: USER_ID },
    });
  });

  it('maps books onto vis-network nodes grouped by status', async () => {
    bookRepository.find.mockResolvedValue([
      { id: BOOK_A, title: 'Dune', status: BookRole.READ },
      { id: BOOK_B, title: 'Neuromancer', status: BookRole.WISHLIST },
    ]);

    const { nodes } = await service.getUserGraph(USER_ID);

    expect(nodes).toEqual([
      { id: BOOK_A, label: 'Dune', group: BookRole.READ },
      { id: BOOK_B, label: 'Neuromancer', group: BookRole.WISHLIST },
    ]);
  });

  it('maps connections onto directed edges', async () => {
    connectionRepository.find.mockResolvedValue([
      {
        id: 'conn-1',
        sourceBookId: BOOK_A,
        discoveredBookId: BOOK_B,
        description: 'Sequel',
      },
    ]);

    const { edges } = await service.getUserGraph(USER_ID);

    expect(edges).toEqual([{ id: 'conn-1', from: BOOK_A, to: BOOK_B, label: 'Sequel' }]);
  });

  it('omits the edge label when a connection has no description', async () => {
    connectionRepository.find.mockResolvedValue([
      {
        id: 'conn-1',
        sourceBookId: BOOK_A,
        discoveredBookId: BOOK_B,
        description: null,
      },
    ]);

    const { edges } = await service.getUserGraph(USER_ID);

    expect(edges[0].label).toBeUndefined();
  });

  it('returns an empty graph for a user with no books', async () => {
    await expect(service.getUserGraph(USER_ID)).resolves.toEqual({
      nodes: [],
      edges: [],
    });
  });
});
