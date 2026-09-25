import { validate } from 'class-validator';
import { IsDifferentFrom } from './is-different-from.validator.js';

class Pair {
  first: string;

  @IsDifferentFrom('first')
  second: string;

  constructor(first: string, second: string) {
    this.first = first;
    this.second = second;
  }
}

describe('IsDifferentFrom', () => {
  it('passes when the two properties differ', async () => {
    await expect(validate(new Pair('a', 'b'))).resolves.toEqual([]);
  });

  it('fails when the two properties are equal', async () => {
    const errors = await validate(new Pair('a', 'a'));

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isDifferentFrom');
  });

  it('returns a validation error rather than throwing', async () => {
    // The point of the constraint: the previous @ValidateIf callback threw, which
    // escaped the validation pipe as a 500 instead of becoming a 400.
    await expect(validate(new Pair('a', 'a'))).resolves.toBeInstanceOf(Array);
  });

  it('describes the offending pair in the default message', async () => {
    class Bare {
      first = 'x';

      @IsDifferentFrom('first')
      second = 'x';
    }

    const [error] = await validate(new Bare());

    expect(error.constraints?.isDifferentFrom).toBe('second must be different from first');
  });

  it('treats two undefined properties as equal', async () => {
    const errors = await validate(new Pair(undefined as never, undefined as never));

    expect(errors).toHaveLength(1);
  });
});
