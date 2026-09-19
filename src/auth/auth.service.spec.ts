import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRole } from '../common/types/enums/user-role.enum.js';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    create: ReturnType<typeof vi.fn>;
    findByUsername: ReturnType<typeof vi.fn>;
    findByUsernameWithPassword: ReturnType<typeof vi.fn>;
    findOneById: ReturnType<typeof vi.fn>;
  };
  let jwtService: { signAsync: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    usersService = {
      create: vi.fn(),
      findByUsername: vi.fn(),
      findByUsernameWithPassword: vi.fn(),
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

  it('delegates registration to UsersService with the plain password', async () => {
    usersService.create.mockImplementation(async ({ password: _password, ...data }) => ({
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

    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Ada',
      lastName: 'Lovelace',
      username: 'ada',
      password: 'password-123',
    });
    // The hash must never be forwarded from here, nor come back in the response.
    expect(usersService.create.mock.calls[0][0]).not.toHaveProperty('hashedPassword');
    expect(result).not.toHaveProperty('hashedPassword');
  });

  it('reads the credential record through the password-selecting lookup', async () => {
    const hashedPassword = await bcrypt.hash('correct-password', 10);
    usersService.findByUsernameWithPassword.mockResolvedValue({
      id: 'user-1',
      username: 'ada',
      hashedPassword,
    });
    jwtService.signAsync.mockResolvedValue('signed-token');

    await service.signin('ada', 'correct-password');

    // Regression guard for the login bug: findByUsername omits the `select: false`
    // hash, so using it here made bcrypt.compare fail for every user.
    expect(usersService.findByUsernameWithPassword).toHaveBeenCalledWith('ada');
    expect(usersService.findByUsername).not.toHaveBeenCalled();
  });

  it('rejects login for an unknown user or invalid password', async () => {
    usersService.findByUsernameWithPassword.mockResolvedValueOnce(null);
    await expect(service.signin('unknown', 'password-123')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    const hashedPassword = await bcrypt.hash('correct-password', 10);
    usersService.findByUsernameWithPassword.mockResolvedValueOnce({
      id: 'user-1',
      username: 'ada',
      hashedPassword,
    });
    await expect(service.signin('ada', 'wrong-password')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('returns a signed JWT after valid login', async () => {
    const hashedPassword = await bcrypt.hash('correct-password', 10);
    usersService.findByUsernameWithPassword.mockResolvedValue({
      id: 'user-1',
      username: 'ada',
      hashedPassword,
    });
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
