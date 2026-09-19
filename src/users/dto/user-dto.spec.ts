import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';

// Mirrors the global pipe configured in main.ts.
const pipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});

const validate = (metatype: new () => object, value: unknown) =>
  pipe.transform(value, { type: 'body', metatype });

describe('CreateUserDto', () => {
  const valid = {
    name: 'Ada',
    lastName: 'Lovelace',
    username: 'ada',
    password: 'password-123',
  };

  it('accepts a plain password', async () => {
    await expect(validate(CreateUserDto, { ...valid })).resolves.toMatchObject({
      username: 'ada',
      password: 'password-123',
    });
  });

  it('rejects a client-supplied hashedPassword', async () => {
    // forbidNonWhitelisted turns the removed property into a 400 rather than
    // silently dropping it, so an Angular client gets a clear error.
    await expect(
      validate(CreateUserDto, { ...valid, hashedPassword: '$2b$10$attacker-controlled' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a password shorter than 8 characters', async () => {
    await expect(
      validate(CreateUserDto, { ...valid, password: 'short' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an unknown role value', async () => {
    await expect(
      validate(CreateUserDto, { ...valid, role: 'SUPERADMIN' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('UpdateUserDto', () => {
  it('accepts a partial profile patch', async () => {
    await expect(validate(UpdateUserDto, { name: 'Augusta' })).resolves.toEqual({
      name: 'Augusta',
    });
  });

  it('rejects a hashedPassword field', async () => {
    await expect(
      validate(UpdateUserDto, { hashedPassword: '$2b$10$attacker-controlled' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a password change through the profile route', async () => {
    await expect(
      validate(UpdateUserDto, { password: 'new-password-123' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a self-service role escalation', async () => {
    await expect(validate(UpdateUserDto, { role: 'ADMIN' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
