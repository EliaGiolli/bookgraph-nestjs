import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { UserRole } from '../common/types/enums/user-role.enum.js';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let queryBuilder: {
    addSelect: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    getOne: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    queryBuilder = {
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      getOne: vi.fn(),
    };
    repository = {
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ id: 'user-1', role: UserRole.USER, ...data })),
      find: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
      createQueryBuilder: vi.fn(() => queryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  const createDto = {
    name: 'Ada',
    lastName: 'Lovelace',
    username: 'ada',
    password: 'password-123',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('bcrypt-hashes the plain password and never persists it verbatim', async () => {
      repository.findOne.mockResolvedValue(null);

      await service.create({ ...createDto });

      const persisted = repository.create.mock.calls[0][0];
      expect(persisted).not.toHaveProperty('password');
      expect(persisted.hashedPassword).not.toBe('password-123');
      expect(await bcrypt.compare('password-123', persisted.hashedPassword)).toBe(true);
    });

    it('omits the hash from the returned user', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.create({ ...createDto });

      expect(result).not.toHaveProperty('hashedPassword');
      expect(result).toMatchObject({ id: 'user-1', username: 'ada' });
    });

    it('rejects a username that already exists', async () => {
      repository.findOne.mockResolvedValue({ id: 'existing-user', username: 'ada' });

      await expect(service.create({ ...createDto })).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByUsernameWithPassword', () => {
    it('explicitly re-selects the `select: false` hash column', async () => {
      const user = { id: 'user-1', username: 'ada', hashedPassword: 'hash' };
      queryBuilder.getOne.mockResolvedValue(user);

      await expect(service.findByUsernameWithPassword('ada')).resolves.toBe(user);
      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.hashedPassword');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.username = :username', {
        username: 'ada',
      });
    });
  });

  describe('findByUsername', () => {
    it('uses the default lookup, which leaves the hash out', async () => {
      repository.findOne.mockResolvedValue(null);

      await service.findByUsername('ada');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { username: 'ada' } });
      expect(repository.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('throws NotFoundException for an unknown id', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('merges the patch onto the existing user', async () => {
      repository.findOne.mockResolvedValue({ id: 'user-1', name: 'Ada', lastName: 'L' });

      await service.update('user-1', { name: 'Augusta' });

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'user-1', name: 'Augusta' }),
      );
    });
  });

  describe('remove', () => {
    it('throws NotFoundException instead of deleting nothing', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
