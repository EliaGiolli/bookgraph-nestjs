import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateBookConnectionDto } from './create-book-connection.dto.js';

// Mirrors the global pipe from main.ts.
const pipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});
const validate = (value: unknown) =>
  pipe.transform(value, { type: 'body', metatype: CreateBookConnectionDto });

const BOOK_A = 'd3b07384-d113-424a-a521-30596287f391';
const BOOK_B = 'e5c18495-e224-535b-b632-41607398f402';

describe('CreateBookConnectionDto', () => {
  it('accepts a connection between two different books', async () => {
    await expect(
      validate({ sourceBookId: BOOK_A, discoveredBookId: BOOK_B, description: 'Sequel' }),
    ).resolves.toMatchObject({ sourceBookId: BOOK_A, discoveredBookId: BOOK_B });
  });

  it('rejects a self-referencing connection with a 400', async () => {
    // The old @ValidateIf callback threw a raw Error from inside the validation
    // pipe, which escaped as a 500 rather than a field-level 400.
    await expect(
      validate({ sourceBookId: BOOK_A, discoveredBookId: BOOK_A }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reports the self-reference as a readable field message', async () => {
    const error = await validate({ sourceBookId: BOOK_A, discoveredBookId: BOOK_A })
      .catch((e: BadRequestException) => e);

    expect((error as BadRequestException).getResponse()).toMatchObject({
      message: expect.arrayContaining([
        'discoveredBookId must be different from sourceBookId',
      ]),
    });
  });

  it('still rejects non-UUID ids', async () => {
    await expect(
      validate({ sourceBookId: 'not-a-uuid', discoveredBookId: BOOK_B }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('requires both ids', async () => {
    await expect(validate({ sourceBookId: BOOK_A })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('treats description as optional', async () => {
    await expect(
      validate({ sourceBookId: BOOK_A, discoveredBookId: BOOK_B }),
    ).resolves.toMatchObject({ description: undefined });
  });

  it('rejects unknown properties', async () => {
    await expect(
      validate({ sourceBookId: BOOK_A, discoveredBookId: BOOK_B, userId: BOOK_A }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
