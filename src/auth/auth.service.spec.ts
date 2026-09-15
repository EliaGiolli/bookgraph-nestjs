import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRole } from '../common/types/enums/user-role.enum.js';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    findOneById: ReturnType<typeof vi.fn>;
  };
  let jwtService: { signAsync: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    usersService = {
      findOne: vi.fn(),
      create: vi.fn(),
      findOneById: vi.fn(),
    };
    jwtService = { signAsync: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('registers a user with a bcrypt hash and omits the hash from the response', async () => {
    usersService.findOne.mockResolvedValue(null);
    usersService.create.mockImplementation(async (data) => ({
      id: 'user-1',
      ...data,
      role: UserRole.USER,
    }));

    const result = await service.register({
      name: 'Ada',
      lastName: 'Lovelace',
      username: 'ada',
      password: 'password-123',
    });

    expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({
      username: 'ada',
      name: 'Ada',
      lastName: 'Lovelace',
      hashedPassword: expect.any(String),
    }));
    expect(await bcrypt.compare('password-123', usersService.create.mock.calls[0][0].hashedPassword)).toBe(true);
    expect(result).not.toHaveProperty('hashedPassword');
  });

  it('rejects registration when the username already exists', async () => {
    usersService.findOne.mockResolvedValue({ id: 'existing-user' });

    await expect(service.register({
      name: 'Ada',
      lastName: 'Lovelace',
      username: 'ada',
      password: 'password-123',
    })).rejects.toBeInstanceOf(ConflictException);
    expect(usersService.create).not.toHaveBeenCalled();
  });

  it('rejects login for an unknown user or invalid password', async () => {
    usersService.findOne.mockResolvedValueOnce(null);
    await expect(service.signin('unknown', 'password-123')).rejects.toBeInstanceOf(UnauthorizedException);

    const hashedPassword = await bcrypt.hash('correct-password', 10);
    usersService.findOne.mockResolvedValueOnce({ id: 'user-1', username: 'ada', hashedPassword });
    await expect(service.signin('ada', 'wrong-password')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns a signed JWT after valid login', async () => {
    const hashedPassword = await bcrypt.hash('correct-password', 10);
    usersService.findOne.mockResolvedValue({ id: 'user-1', username: 'ada', hashedPassword });
    jwtService.signAsync.mockResolvedValue('signed-token');

    await expect(service.signin('ada', 'correct-password')).resolves.toEqual({
      access_token: 'signed-token',
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'user-1',
      username: 'ada',
    });
  });

  it('validates the user identified by the JWT subject', async () => {
    const user = { id: 'user-1', username: 'ada', role: UserRole.USER };
    usersService.findOneById.mockResolvedValue(user);

    await expect(service.validateUser({ sub: 'user-1' })).resolves.toBe(user);
    expect(usersService.findOneById).toHaveBeenCalledWith('user-1');
  });
});
