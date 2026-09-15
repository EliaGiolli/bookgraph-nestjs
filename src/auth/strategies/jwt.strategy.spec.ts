import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';

describe('JwtStrategy', () => {
  it('returns the user resolved from the JWT payload', async () => {
    const user = { id: 'user-1', username: 'ada' };
    const authService = {
      validateUser: vi.fn().mockResolvedValue(user),
    } as unknown as AuthService;
    const configService = {
      getOrThrow: vi.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;
    const strategy = new JwtStrategy(authService, configService);

    await expect(strategy.validate({ sub: 'user-1', username: 'ada' })).resolves.toBe(user);
    expect(authService.validateUser).toHaveBeenCalledWith({ sub: 'user-1', username: 'ada' });
  });

  it('rejects a token whose user no longer exists', async () => {
    const authService = {
      validateUser: vi.fn().mockResolvedValue(null),
    } as unknown as AuthService;
    const configService = {
      getOrThrow: vi.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;
    const strategy = new JwtStrategy(authService, configService);

    await expect(strategy.validate({ sub: 'missing-user', username: 'ada' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});