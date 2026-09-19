import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import type { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: ReturnType<typeof vi.fn>;
    signin: ReturnType<typeof vi.fn>;
  };

  const buildController = async (jwtExpiration: string) => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: { getOrThrow: () => jwtExpiration } },
      ],
    }).compile();

    return module.get<AuthController>(AuthController);
  };

  beforeEach(async () => {
    authService = {
      register: vi.fn(),
      signin: vi.fn(),
    };

    controller = await buildController('1d');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates registration to AuthService', async () => {
    const dto = {
      name: 'Ada',
      lastName: 'Lovelace',
      username: 'ada',
      password: 'password-123',
    };
    authService.register.mockResolvedValue({ username: 'ada' });

    await expect(controller.register(dto)).resolves.toEqual({ username: 'ada' });
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('sets an HttpOnly access token cookie after login', async () => {
    authService.signin.mockResolvedValue({ access_token: 'signed-token' });
    const response = { cookie: vi.fn() } as unknown as Response;

    await expect(controller.login({ username: 'ada', password: 'password-123' }, response))
      .resolves.toEqual({ message: 'Login effettuato' });

    expect(response.cookie).toHaveBeenCalledWith('access_token', 'signed-token', expect.objectContaining({
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86_400_000,
      path: '/',
    }));
  });

  it('derives the cookie lifetime from the configured JWT_EXPIRATION', async () => {
    // Regression guard: the maxAge used to be hardcoded at 60s, so any other
    // JWT_EXPIRATION left the browser cookie out of step with the token.
    controller = await buildController('15m');
    authService.signin.mockResolvedValue({ access_token: 'signed-token' });
    const response = { cookie: vi.fn() } as unknown as Response;

    await controller.login({ username: 'ada', password: 'password-123' }, response);

    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'signed-token',
      expect.objectContaining({ maxAge: 900_000 }),
    );
  });
});
